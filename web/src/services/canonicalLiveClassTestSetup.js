jest.mock("../firebase", () => ({
  db: {},
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  onSnapshot: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
}));
