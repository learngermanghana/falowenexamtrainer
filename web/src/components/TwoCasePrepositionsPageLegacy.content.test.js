import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Grammar from './TwoCasePrepositionsPageLegacy';

test('chapter 12.1 teaches both case rules and the movement exception together', () => {
  render(<MemoryRouter><Grammar /></MemoryRouter>);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Wechselpräpositionen und Dativpräpositionen');
  expect(screen.getByText(/Movement alone does not mean Akkusativ/)).toBeVisible();
  expect(screen.getByRole('heading', { name: 'mit, bei und zu' })).toBeVisible();
  expect(screen.getByText(/zu always takes Dativ/)).toBeVisible();
  expect(screen.getByText(/Plural Dativ usually adds -n/)).toBeVisible();
  expect(screen.getByRole('link', { name: 'Open Chapter 12.1 workbook' })).toHaveAttribute('href', '/campus/course/two-case-prepositions-wechselpraepositionen-day-18?view=workbook');
});
