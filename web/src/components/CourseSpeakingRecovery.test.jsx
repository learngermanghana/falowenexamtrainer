import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CourseSpeakingMockAssignment, { contiguousVerifiedSpeakingParts } from './CourseSpeakingMockAssignment';
import { fetchCourseSpeakingMockStatus, submitCourseSpeakingMock } from '../services/courseSpeakingMockService';
import { announceExamSuccess } from '../services/interactionFeedback';
jest.mock('../services/interactionFeedback', () => ({ announceExamSuccess: jest.fn() }));

jest.mock('../context/AuthContext', () => ({ useAuth: () => ({ idToken: 'token', user: { uid: 'learner' } }) }));
jest.mock('react-router-dom', () => ({ Link: ({ children }) => <span>{children}</span> }));
jest.mock('./LiveSpeakPage', () => ({onRecoverCompletedParts}) => (
  <div>Exam
    <button type="button" onClick={onRecoverCompletedParts}>Check saved answer / speaking progress</button>
  </div>
));
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
test('a saved score shows success without exposing Sheet permission errors to the student', async () => {
  fetchCourseSpeakingMockStatus.mockResolvedValue({ ...completed, sheet: { ok: false, pending: true, message: 'The caller does not have permission' } });
  render(<CourseSpeakingMockAssignment assignmentKey="A2-8.22" />);
  await screen.findByText('Your Teil scores');
  expect(announceExamSuccess).toHaveBeenCalledWith('Speaking mock completed. Your result is saved.');
  expect(screen.queryByText(/Google Sheets|caller does not have permission|Retry Google/)).toBeNull();
  expect(screen.getByText(/Your result is saved. Open Results/)).toBeTruthy();
});

test('A1 Day 19 opens the required three-part A1 assessment with A1 instructions', async () => {
  fetchCourseSpeakingMockStatus.mockResolvedValue({ completed: false, parts: [] });
  render(<CourseSpeakingMockAssignment assignmentKey="A1-5.9" />);
  expect(await screen.findByText('Goethe A1 Speaking Confidence Lab')).toBeTruthy();
  expect(screen.getByText(/Sich vorstellen/)).toBeTruthy();
  expect(screen.getByText(/Fragen und Antworten/)).toBeTruthy();
  expect(screen.getByText(/Bitten und Reagieren/)).toBeTruthy();
});

test('only a consecutive set of verified Teils may advance the speaking exam', () => {
  const part = i => ({sessionId: `session-${i}`, teil: `Teil ${i}`, assessment:{maxScore:10,score:6}});
  expect(contiguousVerifiedSpeakingParts([part(2),part(3)])).toEqual([]);
  expect(contiguousVerifiedSpeakingParts([part(2),part(1)])).toEqual([part(1),part(2)]);
  expect(contiguousVerifiedSpeakingParts([part(1),{...part(2),assessment:null},part(3)])).toEqual([part(1)]);
});

test('A1 Day 19 recovers a finished Teil 2 from verified cloud scores instead of rerecording', async () => {
  const attemptId = '11111111-1111-4111-8111-111111111111';
  const tasks = [{id:'one',teilLabel:'Teil 1'}, {id:'two',teilLabel:'Teil 2'}, {id:'three',teilLabel:'Teil 3'}];
  const parts = [1,2].map(i=>({sessionId:`saved-${i}`,teil:`Teil ${i}`,taskId:tasks[i-1].id,
    assessment:{maxScore:10,score:7,practiceOnly:true}}));
  const storageKey = 'falowen:graded-speaking:learner:A1-5.9';
  localStorage.setItem(storageKey,JSON.stringify({tasks,results:[parts[0]],attemptId}));
  fetchCourseSpeakingMockStatus
    .mockResolvedValueOnce({completed:false,attemptId,recovery:{parts:[parts[0]]}})
    .mockResolvedValueOnce({completed:false,attemptId,recovery:{parts}});
  render(<CourseSpeakingMockAssignment assignmentKey="A1-5.9" />);
  await screen.findByText(/Teil 2 of 3/);
  fireEvent.click(screen.getByRole('button',{name:'Check completed speaking Teils'}));
  await screen.findByText(/Teil 3 of 3/);
  expect(screen.getByText(/Teil 2 recovered/)).toBeInTheDocument();
  expect(submitCourseSpeakingMock).not.toHaveBeenCalled();
  expect(JSON.parse(localStorage.getItem(storageKey)).results).toHaveLength(2);
});

test('checking A1 Day 19 verified progress never fabricates a missing first Teil', async () => {
  const attemptId = '11111111-1111-4111-8111-111111111111';
  const tasks=[{id:'one',teilLabel:'Teil 1'},{id:'two',teilLabel:'Teil 2'},{id:'three',teilLabel:'Teil 3'}];
  const storageKey='falowen:graded-speaking:learner:A1-5.9';
  localStorage.setItem(storageKey,JSON.stringify({tasks,results:[],attemptId}));
  fetchCourseSpeakingMockStatus.mockResolvedValue({completed:false,attemptId,recovery:{
    parts:[{sessionId:'later',teil:'Teil 2',assessment:{maxScore:10,score:10}}],
  }});
  render(<CourseSpeakingMockAssignment assignmentKey="A1-5.9" />);
  await screen.findByText(/Teil 1 of 3/);
  fireEvent.click(screen.getByRole('button',{name:'Check completed speaking Teils'}));
  await screen.findByText(/No graded Teil was found yet/);
  expect(screen.getByText(/Teil 1 of 3/)).toBeInTheDocument();
  expect(submitCourseSpeakingMock).not.toHaveBeenCalled();
});


test('B1 uses a single in-exam recovery control to advance to the next saved Teil', async () => {
  const attemptId = '11111111-1111-4111-8111-111111111111';
  const tasks = [
    { id:'b1-1', teilLabel:'Teil 1' },
    { id:'b1-2', teilLabel:'Teil 2' },
    { id:'b1-3', teilLabel:'Teil 3' },
  ];
  const saved = [1,2].map(i=>({ sessionId:`b1-saved-${i}`, teil:`Teil ${i}`,
    taskId:tasks[i-1].id, assessment:{maxScore:10,score:7,practiceOnly:true} }));
  const storageKey = 'falowen:graded-speaking:learner:B1-7.23';
  localStorage.setItem(storageKey, JSON.stringify({tasks,results:[saved[0]],attemptId}));
  fetchCourseSpeakingMockStatus
    .mockResolvedValueOnce({completed:false,attemptId,recovery:{parts:[saved[0]]}})
    .mockResolvedValueOnce({completed:false,attemptId,recovery:{parts:saved}});
  render(<CourseSpeakingMockAssignment assignmentKey="B1-7.23" />);
  await screen.findByText(/Teil 2 of 3/);
  expect(screen.queryByRole('button',{name:'Check completed speaking Teils'})).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'Check saved answer / speaking progress'}));
  await screen.findByText(/Teil 3 of 3/);
  expect(fetchCourseSpeakingMockStatus).toHaveBeenCalledTimes(2);
  expect(submitCourseSpeakingMock).not.toHaveBeenCalled();
  expect(JSON.parse(localStorage.getItem(storageKey)).results).toHaveLength(2);
});

const B1_ATTEMPT = '11111111-1111-4111-8111-111111111111';
const B1_TASKS = [1,2,3].map(i=>({id:`b1-task-${i}`,level:'B1',teilLabel:`Teil ${i}`,topicPrompt:`B1 task ${i}`}));
const B1_PARTS = [1,2,3].map(i=>({
  sessionId:`b1-saved-${i}`,teil:`Teil ${i}`,taskId:`b1-task-${i}`,
  assessment:{maxScore:10,score:7,percent:70,practiceOnly:true},
}));
const B1_SAVED_RESULT = {
  completed:true,score:70,passed:true,
  sectionScores:{teil1:70,teil2:70,teil3:70},sheet:{ok:true},
};
const B1_DRAFT_KEY = 'falowen:graded-speaking:learner:B1-7.23';

test('B1 Day 23: Teil 3 already marked in the cloud finalizes automatically from the last-step recovery button',async()=>{
  localStorage.setItem(B1_DRAFT_KEY,JSON.stringify({
    attemptId:B1_ATTEMPT,tasks:B1_TASKS,results:B1_PARTS.slice(0,2),
  }));
  fetchCourseSpeakingMockStatus
    .mockResolvedValueOnce({completed:false,attemptId:B1_ATTEMPT,recovery:{parts:B1_PARTS.slice(0,2)}})
    .mockResolvedValueOnce({completed:false,attemptId:B1_ATTEMPT,recovery:{parts:B1_PARTS}});
  submitCourseSpeakingMock.mockResolvedValue(B1_SAVED_RESULT);
  render(<CourseSpeakingMockAssignment assignmentKey='B1-7.23'/>);
  expect(await screen.findByText(/Teil 3 of 3/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'Check saved Teil 3 and finalize score'}));
  expect(await screen.findByText(/All three speaking parts assessed — course score saved/)).toBeInTheDocument();
  expect(submitCourseSpeakingMock).toHaveBeenCalledTimes(1);
  expect(submitCourseSpeakingMock).toHaveBeenCalledWith(expect.objectContaining({
    assignmentKey:'B1-7.23',attemptId:B1_ATTEMPT,
    sessionIds:['b1-saved-1','b1-saved-2','b1-saved-3'],
  }));
  expect(localStorage.getItem(B1_DRAFT_KEY)).toBeNull();
});

test('B1 Day 23: all three Teils saved locally and in cloud retry final score when first submission fails',async()=>{
  localStorage.setItem(B1_DRAFT_KEY,JSON.stringify({
    attemptId:B1_ATTEMPT,tasks:B1_TASKS,results:B1_PARTS,
  }));
  fetchCourseSpeakingMockStatus.mockResolvedValue({
    completed:false,attemptId:B1_ATTEMPT,recovery:{parts:B1_PARTS,allPartsGraded:true},
  });
  submitCourseSpeakingMock
    .mockRejectedValueOnce(new Error('Temporary score write failure'))
    .mockResolvedValueOnce(B1_SAVED_RESULT);
  render(<CourseSpeakingMockAssignment assignmentKey='B1-7.23'/>);
  expect(await screen.findByText('Submission needs a retry')).toBeInTheDocument();
  expect(screen.getByText(/Temporary score write failure/)).toBeInTheDocument();
  // Recovery is a status read plus a score-write retry, not an examiner retry.
  expect(submitCourseSpeakingMock).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole('button',{name:'Check saved speaking results'}));
  expect(await screen.findByText(/All three speaking parts assessed — course score saved/)).toBeInTheDocument();
  expect(submitCourseSpeakingMock).toHaveBeenCalledTimes(2);
  expect(submitCourseSpeakingMock.mock.calls.every(([v])=>v.attemptId===B1_ATTEMPT
    && v.sessionIds.join(',')==='b1-saved-1,b1-saved-2,b1-saved-3')).toBe(true);
  expect(localStorage.getItem(B1_DRAFT_KEY)).toBeNull();
});
