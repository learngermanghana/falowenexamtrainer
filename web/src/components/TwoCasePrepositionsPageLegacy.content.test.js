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

test('the mit, bei und zu reminder appears after the grammar notes and practice but before the workbook link', () => {
  const { container } = render(<MemoryRouter><Grammar /></MemoryRouter>);
  const headings = Array.from(container.querySelectorAll('h2, h3'));
  const locate = (title) => headings.findIndex(node => node.textContent.trim() === title);
  const mainRule = locate('Movement is not enough — think destination vs position');
  const practice = locate('Choose the correct article');
  const finalNote = locate('mit, bei und zu');
  const workbookPrep = locate('Use the grammar across different tasks');
  const callToAction = locate('Ready for Chapter 12.1?');
  expect(mainRule).toBeGreaterThanOrEqual(0);
  expect(practice).toBeGreaterThan(mainRule);
  expect(workbookPrep).toBeGreaterThan(practice);
  expect(finalNote).toBeGreaterThan(workbookPrep);
  expect(callToAction).toBeGreaterThan(finalNote);
});
