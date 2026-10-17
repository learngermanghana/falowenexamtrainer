import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CourseSpeakingMockAssignment from './CourseSpeakingMockAssignment';
import { fetchCourseSpeakingMockStatus } from '../services/courseSpeakingMockService';

jest.mock('../context/AuthContext', () => ({ useAuth: () => ({ idToken: 'token', user: { uid: 'learner' } }) }));
jest.mock('react-router-dom', () => ({ Link: ({ children }) => <span>{children}</span> }));
jest.mock('./LiveSpeakPage', () => () => <div>Exam</div>);
jest.mock('./SpeakingPracticeHome', () => ({ SpeakingFeedback: () => <div>Feedback</div> }));
jest.mock('../data/speakingDictionary', () => ({ speakingQuestionDictionary: [] }));
jest.mock('../services/courseSpeakingMockService', () => ({ fetchCourseSpeakingMockStatus: jest.fn(), startCourseSpeakingMock: jest.fn(), submitCourseSpeakingMock: jest.fn() }));
const key = 'falowen:graded-speaking:learner:A2-8.22';
const draft = { tasks: [{ id: '1' }, { id: '2' }, { id: '3' }], results: [{ sessionId: 'older', assessment: { percent: 75, summary: 'Saved feedback' } }] };
const completed = { completed: true, score: 80, passed: true, sectionScores: { teil1: 80, teil2: 80, teil3: 80 }, sheet: { ok: true } };
beforeEach(() => { localStorage.clear(); jest.clearAllMocks(); });
test('archives a current draft before clearing it when cloud assignment is completed', async () => {
  localStorage.setItem(key, JSON.stringify(draft));
  fetchCourseSpeakingMockStatus.mockResolvedValue(completed);
  render(<CourseSpeakingMockAssignment assignmentKey="A2-8.22" />);
  await screen.findByText('Your Teil scores');
  expect(JSON.parse(localStorage.getItem(`${key}:recovery`))[0].draft).toEqual(draft);
  expect(localStorage.getItem(key)).toBeNull();
});
test('saved work is visible and downloadable while the cloud request fails', async () => {
  localStorage.setItem(key, JSON.stringify(draft));
  fetchCourseSpeakingMockStatus.mockRejectedValue(new Error('Offline'));
  render(<CourseSpeakingMockAssignment assignmentKey="A2-8.22" />);
  expect(await screen.findByText('Saved speaking work')).toBeTruthy();
  expect(screen.getByText('Download saved work for tutor review')).toBeTruthy();
  await screen.findByText('Offline');
  expect(screen.getByText('Saved feedback')).toBeTruthy();
});
test('malformed archive does not block completed cloud result or delete current draft', async () => {
  localStorage.setItem(`${key}:recovery`, 'broken');
  localStorage.setItem(key, JSON.stringify(draft));
  fetchCourseSpeakingMockStatus.mockResolvedValue(completed);
  render(<CourseSpeakingMockAssignment assignmentKey="A2-8.22" />);
  await screen.findByText('Your Teil scores');
  await waitFor(() => expect(localStorage.getItem(key)).toBe(JSON.stringify(draft)));
  expect(localStorage.getItem(`${key}:recovery`)).toBe('broken');
});
