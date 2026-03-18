const mockBatchUpdate = jest.fn();
const mockAppend = jest.fn();
const mockValuesGet = jest.fn();
const mockSpreadsheetsGet = jest.fn();

jest.mock('googleapis', () => ({
  google: {
    auth: {
      JWT: jest.fn(() => ({})),
    },
    sheets: jest.fn(() => ({
      spreadsheets: {
        values: {
          get: mockValuesGet,
          batchUpdate: mockBatchUpdate,
          append: mockAppend,
        },
        get: mockSpreadsheetsGet,
        batchUpdate: jest.fn(),
      },
    })),
  },
}));

describe('upsertStudentToSheet paid field sync', () => {
  beforeEach(() => {
    jest.resetModules();
    mockBatchUpdate.mockReset();
    mockAppend.mockReset();
    mockValuesGet.mockReset();
    mockSpreadsheetsGet.mockReset();

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
});
