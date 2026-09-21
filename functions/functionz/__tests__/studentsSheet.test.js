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
    });

    expect(result).toEqual({ action: 'updated', row: 2 });
    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockUpdate.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        spreadsheetId: 'sheet-123',
        range: 'students!K1:N1',
        valueInputOption: 'RAW',
        requestBody: {
          values: [[
            'TrialStartedAt',
            'TrialEndsAt',
            'TrialPurgeAt',
            'TrialUsedAt',
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
