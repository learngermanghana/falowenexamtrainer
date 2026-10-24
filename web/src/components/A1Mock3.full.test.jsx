import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import A1FinalMockExamPage from './A1FinalMockExamPage';
import {
  A1_MOCK_3_ID, A1_MOCK_3_READING, A1_MOCK_3_LISTENING,
  A1_MOCK_3_WRITING, A1_MOCK_3_WRITING_TASK, A1_MOCK_3_SPEAKING,
} from '../data/a1FinalMock3Data';
import { scoreA1MockWriting } from '../services/a1FinalMockService';
import { getMockExam } from '../data/mockExamCatalog';

jest.mock('../context/AuthContext', () => ({ useAuth: () => ({ idToken: '', user: null }) }));
jest.mock('../services/a1FinalMockService', () => ({
  ...jest.requireActual('../services/a1FinalMockService'),
  scoreA1MockWriting: jest.fn(),
}));

const key = 'falowen:a1-final-mock:a1-mock-03:guest';
function mount(stage, extra = {}) {
  localStorage.setItem(key, JSON.stringify({
    mockId: A1_MOCK_3_ID, stage, sectionDeadlineMs: Date.now() + 1200000, ...extra,
  }));
  return render(<MemoryRouter><A1FinalMockExamPage mockId={A1_MOCK_3_ID} /></MemoryRouter>);
}

beforeEach(() => { localStorage.clear(); window.scrollTo = jest.fn(); });
afterEach(() => jest.clearAllMocks());

test('Mock 3 shows four modules and uses all 15 supplied reading questions', () => {
  const catalog = getMockExam('a1-final-03');
  expect(catalog).toMatchObject({ status: 'ready', mode: 'full', questionSetId: 'a1-mock-03' });
  expect(catalog.sections).toEqual(['Lesen', 'Hören', 'Schreiben', 'Sprechen']);
  expect(Object.values(A1_MOCK_3_READING).flatMap((part) => part.questions)).toHaveLength(15);
  const { container } = mount('lesen');
  expect(screen.getByText('Pizza Blitz')).toBeVisible();
  expect(screen.getByText('Aufzug außer Betrieb!')).toBeVisible();
  expect(screen.getByText('Mein Sohn ist krank', { exact: false })).toBeVisible();
  expect(container.querySelectorAll('[role="radiogroup"]')).toHaveLength(15);
  expect(screen.queryByText(/Lösung:/)).toBeNull();
});

test('Mock 3 uses Hören Sample 3 exact question and audio source', () => {
  expect(A1_MOCK_3_LISTENING.sampleId).toBe('sample-3');
  expect([A1_MOCK_3_LISTENING.teil1, A1_MOCK_3_LISTENING.teil2, A1_MOCK_3_LISTENING.teil3]
    .flatMap((part) => part.questions)).toHaveLength(15);
  expect([A1_MOCK_3_LISTENING.teil1, A1_MOCK_3_LISTENING.teil2, A1_MOCK_3_LISTENING.teil3]
    .map((part) => part.audioObjectKey)).toEqual([
      'a1/horen-part-3/teil-1.mp3', 'a1/horen-part-3/teil-2.mp3',
      'a1/horen-part-3/teil-3.mp3',
    ]);
});

test('writing keeps Eva five-field form and Anna email and sends mock-specific task for marking', async () => {
  scoreA1MockWriting.mockResolvedValue({ score: 20, form: { score: 10 }, letter: { score: 10 } });
  mount('schreiben', { attemptInfo: { attemptId: 'mock3-attempt', attemptNumber: 1, firstAttempt: true } });
  expect(screen.getByText('Miller')).toBeVisible();
  expect(screen.getByText('Hauptstraße 12')).toBeVisible();
  expect(screen.getByText(/Eva Miller kommt aus Kanada/)).toBeVisible();
  const textInputs = screen.getAllByRole('textbox').filter((item) => item.tagName === 'INPUT');
  expect(textInputs).toHaveLength(4);
  ['10115 Berlin', 'Kanada', 'Architektin', 'A1'].forEach((value, i) => {
    fireEvent.change(textInputs[i], { target: { value } });
  });
  fireEvent.click(screen.getByLabelText('Abendkurs'));
  fireEvent.change(screen.getByLabelText('Ihre E-Mail'), { target: {
    value: 'Liebe Anna, ich lade dich am Samstag um 18 Uhr zum Essen ein. Kannst du bitte Getränke mitbringen? Liebe Grüße, Max',
  } });
  expect(screen.queryByText(/ich möchte dich am Samstag um 18 Uhr zum Essen zu mir nach Hause einladen/)).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Submit Schreiben → Sprechen' }));
  await waitFor(() => expect(scoreA1MockWriting).toHaveBeenCalledWith(expect.objectContaining({
    mockId: A1_MOCK_3_ID, attemptId: 'mock3-attempt',
    formValues: { 1: '10115 Berlin', 2: 'Kanada', 3: 'Architektin', 4: 'Abendkurs', 5: 'A1' },
  })));
});

test('speaking uses the user-supplied Brot card and the water picture, not Mock 2 Bäckerei/pencil', () => {
  expect(A1_MOCK_3_WRITING_TASK.recipient).toBe('Anna');
  expect(A1_MOCK_3_WRITING.teil1.formRows.filter((field) => field.number)).toHaveLength(5);
  expect(A1_MOCK_3_SPEAKING.tasks.map((task) => task.id)).toEqual(['teil1', 'teil2', 'teil3']);
  const { container } = mount('sprechen');
  expect(screen.getByText('Brot')).toBeVisible();
  expect(screen.getByRole('img', { name: 'Ein Glas Wasser' })).toBeVisible();
  expect(container.querySelector('[data-a1-final-mock]')).toBeTruthy();
  expect(screen.queryByText('Bäckerei')).toBeNull();
});
