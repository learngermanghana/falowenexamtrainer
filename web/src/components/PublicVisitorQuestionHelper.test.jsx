import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PublicVisitorQuestionHelper from './PublicVisitorQuestionHelper';
import { isPublicVisitorPath } from '../utils/publicVisitorPaths';
import { visitorAnswer } from '../data/visitorQuestions';
jest.mock('../services/publicClassCatalogService',()=>({loadPublicClasses:jest.fn()}));
test.each(['/placement-test','/books','/books/deutsch-a1-course-workbook','/classes','/classes/a1-hamburg-klasse','/exam-practice/a1','/reviews','/learn-german-a2','/mock/register'])('public helper mounts on %s',path=>{
  render(<MemoryRouter initialEntries={[path]}><PublicVisitorQuestionHelper /></MemoryRouter>);
  expect(screen.getByRole('button',{name:/Questions\? Ask us/})).toBeInTheDocument();
});
test.each(['/','/campus','/campus/course/a1-day-1','/exams/a1','/login','/signup','/onboarding'])('no duplicate homepage or protected helper on %s',path=>{
  render(<MemoryRouter initialEntries={[path]}><PublicVisitorQuestionHelper /></MemoryRouter>);
  expect(screen.queryByRole('button',{name:/Questions\? Ask us/})).toBeNull();
});
test('exam and book fees never return course tuition',()=>{
  expect(visitorAnswer('What are the fees?',{context:'exams'}).href).toBe('https://exams.falowen.app/#pricing');
  expect(visitorAnswer('What is the book price?').href).toBe('https://www.falowen.app/books');
  expect(visitorAnswer('How much?',{context:'books'}).text).not.toContain('3,000');
  expect(isPublicVisitorPath('/campus/course/private')).toBe(false);
});
