import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import A1Mock3Reading from './A1Mock3Reading';
import { A1_MOCK_3_ID, A1_MOCK_3_READING, A1_MOCK_3_LISTENING } from '../data/a1FinalMock3Data';
import {
  A1_EXAM_HOEREN_SAMPLE_3_TEIL1, A1_EXAM_HOEREN_SAMPLE_3_TEIL2, A1_EXAM_HOEREN_SAMPLE_3_TEIL3,
} from '../data/a1ExamHorenSample3';

jest.mock('../context/AuthContext', () => ({ useAuth: () => ({ user: { uid: 'learner-03' } }) }));
const storageKey = 'falowen:a1-mock-03:lesen:learner-03';
beforeEach(() => localStorage.clear());

const selectAnswers = (values) => {
  const groups = screen.getAllByRole('radiogroup');
  expect(groups).toHaveLength(5);
  groups.forEach((group, index) => fireEvent.click(within(group).getByLabelText(values[index])));
};

test('Mock 3 contains 15 non-overlapping reading questions and exact reading answer keys', () => {
  expect(A1_MOCK_3_ID).toBe('a1-mock-03');
  expect(A1_MOCK_3_READING.teil1.texts.map((item) => [item.to, item.from, item.subject])).toEqual([
    ['Markus', 'Thomas', 'Einladung zum Grillen'],
    ['Sarah', 'Nina', 'Treffen am Sonntag'],
  ]);
  expect(Object.values(A1_MOCK_3_READING).flatMap((part) => part.questions.map((q) => q.number)))
    .toEqual(Array.from({ length: 15 }, (_, index) => index + 1));
  expect(A1_MOCK_3_READING.teil1.questions.map((q) => q.answer)).toEqual([
    'richtig', 'falsch', 'richtig', 'falsch', 'richtig',
  ]);
  expect(A1_MOCK_3_READING.teil2.questions.map((q) => q.answer)).toEqual(['a', 'a', 'b', 'a', 'a']);
  expect(A1_MOCK_3_READING.teil3.questions.map((q) => q.answer)).toEqual([
    'falsch', 'richtig', 'richtig', 'falsch', 'falsch',
  ]);
  expect(A1_MOCK_3_READING.teil2.questions.every((q) => q.options.length === 2)).toBe(true);
  expect(A1_MOCK_3_READING.teil3.questions.every((q) => q.notice.heading && q.notice.lines.length)).toBe(true);
});

test('reading uses the existing Mock 2 paper and browser format across three parts', () => {
  const { container } = render(<MemoryRouter><A1Mock3Reading /></MemoryRouter>);
  expect(screen.getByText('Wir fangen um 18:30 Uhr an.', { exact: false })).toBeVisible();
  expect(screen.getByText('Mein Sohn ist krank', { exact: false })).toBeVisible();
  expect(container.querySelectorAll('.a1-goethe-mock-paper')).toHaveLength(2);
  expect(screen.getAllByRole('radiogroup')).toHaveLength(5);
  fireEvent.click(screen.getByRole('button', { name: /Teil 2/ }));
  expect(screen.getByText('Pizza Blitz')).toBeVisible();
  expect(screen.getAllByRole('radiogroup')).toHaveLength(5);
  expect(container.querySelectorAll('.a1-goethe-mock-browser-panel')).toHaveLength(10);
  fireEvent.click(screen.getByRole('button', { name: /Teil 3/ }));
  expect(screen.getByText('Aufzug außer Betrieb!')).toBeVisible();
  expect(container.querySelectorAll('.a1-goethe-mock-notice-card')).toHaveLength(5);
  expect(screen.queryByText(/Lösung:/)).toBeNull();
});

test('15 answers autosave, marking reveals key only on submission and retake clears answers', () => {
  render(<MemoryRouter><A1Mock3Reading /></MemoryRouter>);
  expect(screen.getByRole('button', { name: 'Antworten prüfen' })).toBeDisabled();
  selectAnswers(['Richtig', 'Falsch', 'Richtig', 'Falsch', 'Richtig']);
  fireEvent.click(screen.getByRole('button', { name: /Teil 2/ }));
  selectAnswers(['Text A', 'Text A', 'Text B', 'Text A', 'Text A']);
  fireEvent.click(screen.getByRole('button', { name: /Teil 3/ }));
  selectAnswers(['Falsch', 'Richtig', 'Richtig', 'Falsch', 'Falsch']);
  const stored = JSON.parse(localStorage.getItem(storageKey));
  expect(stored.answers['t1-2']).toBe('falsch');
  expect(stored.answers['t2-8']).toBe('b');
  expect(stored.answers['t3-15']).toBe('falsch');
  expect(screen.getByRole('button', { name: 'Antworten prüfen' })).toBeEnabled();
  fireEvent.click(screen.getByRole('button', { name: 'Antworten prüfen' }));
  expect(screen.getByText('Ergebnis: 15/15 · 100%')).toBeVisible();
  expect(screen.getAllByText(/Lösung:/)).toHaveLength(5);
  expect(screen.getAllByRole('radio').every((input) => input.disabled)).toBe(true);
  fireEvent.click(screen.getByRole('button', { name: /Teil 2/ }));
  expect(screen.getAllByText(/Lösung:/)).toHaveLength(5);
  fireEvent.click(screen.getByRole('button', { name: 'Noch einmal üben' }));
  expect(screen.queryByText(/Lösung:/)).toBeNull();
  expect(screen.getByRole('button', { name: 'Antworten prüfen' })).toBeDisabled();
});

test('Mock 3 Hören references the same exact sample 3 data and audio keys', () => {
  expect(A1_MOCK_3_LISTENING.sampleId).toBe('sample-3');
  expect(A1_MOCK_3_LISTENING.teil1).toBe(A1_EXAM_HOEREN_SAMPLE_3_TEIL1);
  expect(A1_MOCK_3_LISTENING.teil2).toBe(A1_EXAM_HOEREN_SAMPLE_3_TEIL2);
  expect(A1_MOCK_3_LISTENING.teil3).toBe(A1_EXAM_HOEREN_SAMPLE_3_TEIL3);
  expect([A1_MOCK_3_LISTENING.teil1, A1_MOCK_3_LISTENING.teil2, A1_MOCK_3_LISTENING.teil3]
    .flatMap((part) => part.questions)).toHaveLength(15);
  expect([A1_MOCK_3_LISTENING.teil1, A1_MOCK_3_LISTENING.teil2, A1_MOCK_3_LISTENING.teil3]
    .map((part) => part.audioObjectKey)).toEqual([
      'a1/horen-part-3/teil-1.mp3', 'a1/horen-part-3/teil-2.mp3', 'a1/horen-part-3/teil-3.mp3',
    ]);
});
