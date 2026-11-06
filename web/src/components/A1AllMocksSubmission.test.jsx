import React from 'react';
import axios from 'axios';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import A1FinalMockExamPage from './A1FinalMockExamPage';
import taskVersions from '../data/assessmentTaskVersions.json';

// Exercise real component + services; mocking the scorer hides pre-request errors.
jest.mock('axios');
jest.mock('../context/AuthContext', () => ({ useAuth: () => ({ idToken: 'test-token', user: { uid: 'test-student' } }) }));
jest.mock('../hooks/useAssessmentRestriction', () => ({ useAssessmentRestriction: jest.fn() }));
jest.mock('../services/a1AudioService', () => ({ fetchA1MockAudioPlaybackUrl: jest.fn().mockResolvedValue({ url: 'test.mp3' }) }));
jest.mock('../services/a1ExamHorenAudioService', () => ({ fetchA1ExamHorenAudioPlaybackUrl: jest.fn().mockResolvedValue({ url: 'test.mp3' }) }));
const mocks = Array.from({ length: 8 }, (_, i) => `a1-mock-0${i + 1}`);
const speakingResult = { score: 20, maxScore: 25, parts: {}, receiptId: 'test-speaking-receipt' };
const submittedAnswers = Object.fromEntries(['teil1', 'teil2', 'teil3'].map((id, i) => [id, {
  submitted: true, transcript: `Meine Antwort ${i + 1}`, analysisFeedback: 'Saved feedback',
}]));
let failSpeaking;
beforeEach(() => {
  localStorage.clear(); jest.clearAllMocks(); window.scrollTo = jest.fn(); failSpeaking = false;
  axios.post.mockImplementation(async (url, payload) => {
    if (url.endsWith('/speaking/a1-mock-score')) {
      if (failSpeaking) throw new Error('Temporary marking failure');
      return { data: { result: speakingResult } };
    }
    if (url.endsWith('/writing/a1-mock-score')) return { data: { result: { score: 20 } } };
    if (url.endsWith('/a1-mock/attempt/save')) return { data: {
      completionSync: { ok: true }, verifiedOverall: { score: 80, maxScore: 100, passed: true },
      verifiedSectionScores: { lesen: 20, hoeren: 20, schreiben: 20, sprechen: 20 },
      readingAnswerKey: {}, listeningAnswerKey: {},
    } };
    throw new Error(`Unexpected endpoint: ${url}`);
  });
});
function mount(mockId, { expired = false, partial = false } = {}) {
  const key = `falowen:a1-final-mock:${mockId}:test-student`;
  localStorage.setItem(key, JSON.stringify({
    mockId, stage: expired ? 'sprechen' : 'lesen', assessmentVersion: 'four-module-v2',
    sectionDeadlineMs: Date.now() + (expired ? -1000 : 1200000),
    attemptInfo: { attemptId: `${mockId}-attempt`, firstAttempt: true, attemptNumber: 1 },
    sectionScores: expired ? { lesen: 20, hoeren: 20, schreiben: 20 } : {},
    hoerenAudio: { 'teil-1': 'ended', 'teil-2': 'ended', 'teil-3': 'ended' },
    speakingProgress: { attempts: partial ? { teil1: submittedAnswers.teil1 } : submittedAnswers },
  }));
  render(<MemoryRouter><A1FinalMockExamPage mockId={mockId} /></MemoryRouter>);
  return key;
}
async function expectCompleted(mockId, key, partial = false) {
  await waitFor(() => expect(axios.post).toHaveBeenCalledWith(
    expect.stringContaining('/speaking/a1-mock-score'),
    expect.objectContaining({ mockId, attemptId: `${mockId}-attempt`,
      taskVersion: Number(mockId.slice(-2)) >= 4 ? `${mockId}-speaking-v1`
        : taskVersions[mockId === 'a1-mock-01' ? 'A1' : `A1_MOCK_${Number(mockId.slice(-2))}`].speaking,
    }), expect.objectContaining({ headers: { Authorization: 'Bearer test-token' }, timeout: 55000 }),
  ));
  const payload = axios.post.mock.calls.find(([url]) => url.endsWith('/speaking/a1-mock-score'))[1];
  expect(payload.attempts.map(a => a.transcript)).toEqual(partial
    ? ['Meine Antwort 1', '', ''] : ['Meine Antwort 1', 'Meine Antwort 2', 'Meine Antwort 3']);
  await waitFor(() => expect(axios.post).toHaveBeenCalledWith(
    expect.stringContaining('/a1-mock/attempt/save'),
    expect.objectContaining({ attemptId: `${mockId}-attempt`, status: 'completed', section: 'result',
      state: expect.objectContaining({ completed: true, speakingResult }),
    }), expect.any(Object),
  ));
  await waitFor(() => expect(screen.getByText('All 4 modules completed')).toBeVisible());
  expect(JSON.parse(localStorage.getItem(key))).toMatchObject({ completed: true, stage: 'result' });
}
test.each(mocks)('%s submits all four modules with saved speaking answers', async mockId => {
  const key = mount(mockId);
  fireEvent.click(screen.getByRole('button', { name: 'Submit Lesen → Hören' }));
  fireEvent.click(screen.getByRole('button', { name: 'Submit Hören → Schreiben' }));
  fireEvent.change(screen.getByLabelText('Ihre E-Mail'), { target: { value: 'Liebe Anna, ich komme am Samstag. Viele Grüße, Max' } });
  fireEvent.click(screen.getByRole('button', { name: 'Submit Schreiben → Sprechen' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Mark speaking' }));
  await expectCompleted(mockId, key);
});
test.each(mocks)('%s completes at 00:00 with an incomplete speaking attempt', async mockId => {
  const key = mount(mockId, { expired: true, partial: true });
  await expectCompleted(mockId, key, true);
});
test('Mock 2 retries failed marking at 00:00 without losing submitted answers', async () => {
  failSpeaking = true;
  const key = mount('a1-mock-02', { expired: true, partial: true });
  const retry = await screen.findByRole('button', { name: 'Retry speaking marking' });
  expect(JSON.parse(localStorage.getItem(key))).toMatchObject({ stage: 'sprechen', speakingProgress: { attempts: { teil1: submittedAnswers.teil1 } } });
  expect(axios.post.mock.calls.some(([, payload]) => payload.status === 'completed')).toBe(false);
  failSpeaking = false; fireEvent.click(retry);
  await expectCompleted('a1-mock-02', key, true);
});
