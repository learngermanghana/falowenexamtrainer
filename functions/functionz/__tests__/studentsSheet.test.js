const mockBatchUpdate = jest.fn();
const mockAppend = jest.fn();
const mockUpdate = jest.fn();
const mockValuesGet = jest.fn();
const mockSpreadsheetsGet = jest.fn();

const installGoogleApisMock = () => {
  jest.doMock('googleapis', () => ({
    google: {
      auth: {
        JWT: jest.fn(() => ({})),
      },
      sheets: jest.fn(() => ({
        spreadsheets: {
          values: {
            get: mockValuesGet,
            update: mockUpdate,
            batchUpdate: mockBatchUpdate,
            append: mockAppend,
          },
          get: mockSpreadsheetsGet,
          batchUpdate: jest.fn(),
        },
      })),
    },
  }));
};

describe('upsertStudentToSheet paid field sync', () => {
  beforeEach(() => {
    jest.resetModules();
    mockBatchUpdate.mockReset();
    mockAppend.mockReset();
    mockUpdate.mockReset();
    mockValuesGet.mockReset();
    mockSpreadsheetsGet.mockReset();
    installGoogleApisMock();

    process.env.STUDENTS_SHEET_ID = 'sheet-123';
    process.env.STUDENTS_SHEET_TAB = 'students';
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON = JSON.stringify({
      client_email: 'bot@example.com',
      private_key: '-----BEGIN PRIVATE KEY-----\\nabc\\n-----END PRIVATE KEY-----\\n',
      project_id: 'demo-project',
    });
  });

  afterEach(() => {
    delete process.env.STUDENTS_SHEET_ID;
    delete process.env.STUDENTS_SHEET_TAB;
    delete process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  });

  it('writes student.paid into the Paid column when initialPaymentAmount is missing', async () => {
    mockValuesGet
      .mockResolvedValueOnce({
        data: {
          values: [[
            'Name',
            'Phone',
            'Location',
            'Level',
            'Paid',
            'Balance',
            'ContractStart',
            'ContractEnd',
            'StudentCode',
            'Email',
          ]],
        },
      })
      .mockResolvedValueOnce({ data: { values: [['Bernice598']] } })
      .mockResolvedValueOnce({ data: { values: [['twumasib65@gmail.com']] } });

    const { upsertStudentToSheet } = require('../studentsSheet');

    const result = await upsertStudentToSheet({
      name: 'Bernice Twumasi',
      phone: '245868142',
      location: 'Ghana-Oda',
      level: 'A2',
      paid: 3000,
      balance: 0,
      contractStart: '2025-12-21T16:11:26.434Z',
      contractEnd: '2026-08-16T10:12:41.911Z',
      studentCode: 'Bernice598',
      email: 'twumasib65@gmail.com',
    });

    expect(result).toEqual({ action: 'updated', row: 2 });
    expect(mockBatchUpdate).toHaveBeenCalledTimes(1);

    const batchArgs = mockBatchUpdate.mock.calls[0][0];
    expect(batchArgs.spreadsheetId).toBe('sheet-123');
    expect(batchArgs.requestBody.valueInputOption).toBe('USER_ENTERED');
    expect(batchArgs.requestBody.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ range: 'students!E2', values: [[3000]] }),
        expect.objectContaining({ range: 'students!F2', values: [[0]] }),
      ])
    );
  });

  it('uses the verified paid total instead of a zero initial-payment intent', async () => {
    mockValuesGet
      .mockResolvedValueOnce({ data: { values: [[
        'Name', 'Phone', 'Location', 'Level', 'Paid', 'Balance',
        'ContractStart', 'ContractEnd', 'StudentCode', 'Email',
      ]] } })
      .mockResolvedValueOnce({ data: { values: [['ORG-example-internal-key']] } })
      .mockResolvedValueOnce({ data: { values: [['learner@example.test']] } });

    const { upsertStudentToSheet, __testables } = require('../studentsSheet');
    const student = {
      name: 'Example Learner', studentCode: 'ExampleLearner235',
      email: 'learner@example.test',
      tuitionFee: 3000,
      initialPaymentAmount: 0,
      paid: 2000,
      balanceDue: 1000,
    };

    expect(__testables.resolvePaidValue(student)).toBe(2000);
    expect(__testables.resolveBalanceValue(student)).toBe(1000);
    expect(__testables.resolvePaidValue({
      initialPaymentAmount: 3000, paid: 0,
    })).toBe(0);

    expect(await upsertStudentToSheet(student)).toEqual({ action: 'updated', row: 2 });
    const updates = mockBatchUpdate.mock.calls[0][0].requestBody.data;
    expect(updates).toEqual(expect.arrayContaining([
      expect.objectContaining({ range: 'students!E2', values: [[2000]] }),
      expect.objectContaining({ range: 'students!F2', values: [[1000]] }),
      expect.objectContaining({ range: 'students!I2', values: [['ExampleLearner235']] }),
    ]));
  });

  it('syncs organisation payer metadata for a legacy GH₵2,000 partial payment without duplicating the student row', async () => {
    const headers = [
      'Name', 'Phone', 'Location', 'Level', 'Paid', 'Balance',
      'ContractStart', 'ContractEnd', 'StudentCode', 'Email',
      'BillingResponsibility', 'OrganisationName', 'OrganisationPaymentReference',
      'OrganisationRetainedShare', 'OrganisationNetTuition', 'OrganisationPaymentGross',
      'OrganisationSubmissionId', 'OrganisationId', 'OrganisationBillingEmail',
    ];
    mockValuesGet
      .mockResolvedValueOnce({ data: { values: [headers] } })
      .mockResolvedValueOnce({ data: { values: [['ORG-prior-internal-document-id']] } })
      .mockResolvedValueOnce({ data: { values: [['learner@example.test']] } });

    const { upsertStudentToSheet } = require('../studentsSheet');
    const result = await upsertStudentToSheet({
      name: 'Example Learner', studentCode: 'ExampleLearner357', email: 'learner@example.test',
      paid: 2000, balanceDue: 1000, tuitionFee: 3000,
      billingResponsibility: 'organisation', organisationName: 'Example Organisation',
      organisationPaymentReference: 'FAL-ORG-MAN-TEST', organisationRetainedShare: 0,
      organisationNetTuition: 2000, organisationPaymentGross: 2000,
      organisationSubmissionId: 'batch-demo', organisationId: 'example-org',
      organisationBillingEmail: 'billing@example.test',
    });
    expect(result).toEqual({ action: 'updated', row: 2 });
    const writes = mockBatchUpdate.mock.calls[0][0].requestBody.data;
    const valueAt = col => writes.find(x => x.range === 'students!' + col + '2')?.values?.[0]?.[0];
    expect(valueAt('E')).toBe(2000);
    expect(valueAt('F')).toBe(1000);
    expect(valueAt('I')).toBe('ExampleLearner357');
    expect(valueAt('K')).toBe('organisation');
    expect(valueAt('L')).toBe('Example Organisation');
    expect(valueAt('M')).toBe('FAL-ORG-MAN-TEST');
    expect(valueAt('Q')).toBe('batch-demo');
    expect(valueAt('S')).toBe('billing@example.test');
    expect(mockAppend).not.toHaveBeenCalled();
  });

  it('does not clear organisation metadata when legacy student source omits those fields', async () => {
    const headers = ['Name','StudentCode','Email','BillingResponsibility','OrganisationPaymentReference'];
    mockValuesGet
      .mockResolvedValueOnce({ data: { values: [headers] } })
      .mockResolvedValueOnce({ data: { values: [['Legacy123']] } })
      .mockResolvedValueOnce({ data: { values: [['legacy@example.test']] } });
    const { upsertStudentToSheet } = require('../studentsSheet');
    expect(await upsertStudentToSheet({
      name: 'Legacy Student', studentCode: 'Legacy123', email: 'legacy@example.test',
    })).toEqual({ action: 'updated', row: 2 });
    const writes = mockBatchUpdate.mock.calls[0][0].requestBody.data;
    expect(writes.some(x => /students![DE]2/.test(x.range))).toBe(false);
  });

  it('adds and writes trial retention columns when trial metadata is present', async () => {
    const baseHeaders = [
      'Name',
      'Phone',
      'Location',
      'Level',
      'Paid',
      'Balance',
      'ContractStart',
      'ContractEnd',
      'StudentCode',
      'Email',
    ];
    const trialHeaders = [
      ...baseHeaders,
      'TrialStartedAt',
      'TrialEndsAt',
      'TrialPurgeAt',
      'TrialUsedAt',
      'TrialConvertedAt',
    ];

    mockValuesGet
      .mockResolvedValueOnce({ data: { values: [baseHeaders] } })
      .mockResolvedValueOnce({ data: { values: [trialHeaders] } })
      .mockResolvedValueOnce({ data: { values: [['TRIAL123']] } })
      .mockResolvedValueOnce({ data: { values: [['trial@example.com']] } });

    const { upsertStudentToSheet } = require('../studentsSheet');

    const result = await upsertStudentToSheet({
      name: 'Trial Student',
      studentCode: 'TRIAL123',
      email: 'trial@example.com',
      level: 'A1',
      status: 'trial_active',
      trialStartedAt: '2026-09-21T10:00:00.000Z',
      trialEndsAt: '2026-09-28T10:00:00.000Z',
      trialPurgeAt: '2026-10-28T10:00:00.000Z',
      trialUsedAt: '2026-09-21T10:00:00.000Z',
      trialConvertedAt: '2026-09-22T10:00:00.000Z',
    });

    expect(result).toEqual({ action: 'updated', row: 2 });
    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockUpdate.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        spreadsheetId: 'sheet-123',
        range: 'students!K1:O1',
        valueInputOption: 'RAW',
        requestBody: {
          values: [[
            'TrialStartedAt',
            'TrialEndsAt',
            'TrialPurgeAt',
            'TrialUsedAt',
            'TrialConvertedAt',
          ]],
        },
      })
    );

    const write = mockBatchUpdate.mock.calls[0][0].requestBody.data;
    expect(write).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          range: 'students!K2',
          values: [['2026-09-21T10:00:00.000Z']],
        }),
        expect.objectContaining({
          range: 'students!L2',
          values: [['2026-09-28T10:00:00.000Z']],
        }),
        expect.objectContaining({
          range: 'students!M2',
          values: [['2026-10-28T10:00:00.000Z']],
        }),
        expect.objectContaining({
          range: 'students!N2',
          values: [['2026-09-21T10:00:00.000Z']],
        }),
        expect.objectContaining({
          range: 'students!O2',
          values: [['2026-09-22T10:00:00.000Z']],
        }),
      ])
    );
  });

  it('clamps Balance to derived remaining tuition when explicit balance is stale', async () => {
    mockValuesGet
      .mockResolvedValueOnce({
        data: {
          values: [[
            'Name',
            'Phone',
            'Location',
            'Level',
            'Paid',
            'Balance',
            'ContractStart',
            'ContractEnd',
            'StudentCode',
            'Email',
          ]],
        },
      })
      .mockResolvedValueOnce({ data: { values: [['Ernestina021']] } })
      .mockResolvedValueOnce({ data: { values: [['eaddo2017@gmail.com']] } });

    const { upsertStudentToSheet } = require('../studentsSheet');

    const result = await upsertStudentToSheet({
      name: 'Ernestina Addo',
      phone: '537547709',
      location: 'Accra',
      level: 'B1',
      tuitionFee: 3000,
      paid: 3000,
      balance: 3000,
      contractStart: '2025-12-28T21:43:26.427Z',
      contractEnd: '2026-06-28T21:43:26.427Z',
      studentCode: 'Ernestina021',
      email: 'eaddo2017@gmail.com',
    });

    expect(result).toEqual({ action: 'updated', row: 2 });
    expect(mockBatchUpdate).toHaveBeenCalledTimes(1);

    const batchArgs = mockBatchUpdate.mock.calls[0][0];
    expect(batchArgs.requestBody.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ range: 'students!E2', values: [[3000]] }),
        expect.objectContaining({ range: 'students!F2', values: [[0]] }),
      ])
    );
  });
});
