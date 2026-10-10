import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import A1Mock3Reading from './A1Mock3Reading';
import { A1_MOCK_3_ID, A1_MOCK_3_READING } from '../data/a1FinalMock3Data';

jest.mock('../context/AuthContext', () => ({ useAuth: () => ({ user: { uid: 'learner-03' } }) }));
const storageKey = 'falowen:a1-mock-03:lesen-teil1:learner-03';
beforeEach(() => localStorage.clear());

test('Mock 3 Teil 1 keeps the two provided emails and the five keyed Richtig/Falsch questions', () => {
  expect(A1_MOCK_3_ID).toBe('a1-mock-03');
  expect(A1_MOCK_3_READING.teil1.texts.map((item) => [item.to, item.from, item.subject])).toEqual([
    ['Markus', 'Thomas', 'Einladung zum Grillen'],
    ['Sarah', 'Nina', 'Treffen am Sonntag'],
  ]);
  expect(A1_MOCK_3_READING.teil1.questions.map((item) => item.answer)).toEqual([
    'richtig', 'falsch', 'richtig', 'falsch', 'richtig',
  ]);
  const { container } = render(<MemoryRouter><A1Mock3Reading /></MemoryRouter>);
  expect(screen.getAllByRole('radiogroup')).toHaveLength(5);
  expect(screen.getByText('Wir fangen um 18:30 Uhr an.', { exact: false })).toBeVisible();
  expect(screen.getByText('Mein Sohn ist krank', { exact: false })).toBeVisible();
  expect(screen.queryByText(/Lösung:/)).toBeNull();
  expect(container.querySelectorAll('.a1-goethe-mock-paper')).toHaveLength(2);
});

test('answers autosave separately, reveal the answer key only after submitting all five, and reset', () => {
  render(<MemoryRouter><A1Mock3Reading /></MemoryRouter>);
  const choices = ['Richtig', 'Falsch', 'Richtig', 'Falsch', 'Richtig'];
  expect(screen.getByRole('button', { name: 'Antworten prüfen' })).toBeDisabled();
  screen.getAllByRole('radiogroup').forEach((group, i) => {
    fireEvent.click(within(group).getByLabelText(choices[i]));
  });
  expect(JSON.parse(localStorage.getItem(storageKey)).answers['t1-2']).toBe('falsch');
  fireEvent.click(screen.getByRole('button', { name: 'Antworten prüfen' }));
  expect(screen.getByText('Ergebnis: 5/5 · 100%')).toBeVisible();
  expect(screen.getAllByText(/Lösung:/)).toHaveLength(5);
  expect(screen.getAllByRole('radio').every((item) => item.disabled)).toBe(true);
  fireEvent.click(screen.getByRole('button', { name: 'Noch einmal üben' }));
  expect(screen.queryByText(/Lösung:/)).toBeNull();
  expect(screen.getByRole('button', { name: 'Antworten prüfen' })).toBeDisabled();
});
