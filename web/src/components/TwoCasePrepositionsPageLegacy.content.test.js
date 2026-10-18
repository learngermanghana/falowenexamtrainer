import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Grammar from './TwoCasePrepositionsPageLegacy';

test('chapter 12.1 keeps two-way rules central and dative prepositions as a short A2 preview', () => {
  render(<MemoryRouter><Grammar /></MemoryRouter>);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Wechselpräpositionen');
  expect(screen.getByText(/Movement alone does not mean Akkusativ/)).toBeVisible();
  expect(screen.getByRole('heading', { name: 'mit, bei und zu' })).toBeVisible();
  expect(screen.getByText(/are dative prepositions, not two-way prepositions/)).toBeVisible();
  expect(screen.getByText(/study dative prepositions in more detail in A2/)).toBeVisible();
  expect(screen.queryByRole('heading', { name: 'From Nominativ to Akkusativ and Dativ' })).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Open Chapter 12.1 workbook' })).toHaveAttribute('href', '/campus/course/two-case-prepositions-wechselpraepositionen-day-18?view=workbook');
});
