import React from 'react';
import {render,screen,fireEvent,within,waitFor} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import A1FinalMockExamPage from './A1FinalMockExamPage';
import {A1_MOCK_2_ID,A1_MOCK_2_LISTENING} from '../data/a1FinalMock2Data';
import {A1_EXAM_HOEREN_SAMPLE_2_TEIL1,A1_EXAM_HOEREN_SAMPLE_2_TEIL2,A1_EXAM_HOEREN_SAMPLE_2_TEIL3} from '../data/a1ExamHorenSample2';
import {scoreA1MockWriting} from '../services/a1FinalMockService';
import {fetchA1ExamHorenAudioPlaybackUrl} from '../services/a1ExamHorenAudioService';
jest.mock('../services/a1ExamHorenAudioService',()=>({fetchA1ExamHorenAudioPlaybackUrl:jest.fn().mockResolvedValue({url:'https://audio.example/part.mp3'})}));
jest.mock('../context/AuthContext',()=>({useAuth:()=>({idToken:'',user:null})}));
jest.mock('../services/a1FinalMockService',()=>({...jest.requireActual('../services/a1FinalMockService'),scoreA1MockWriting:jest.fn()}));
const key='falowen:a1-final-mock:a1-mock-02:guest';
function mount(stage,extra={}) {localStorage.setItem(key,JSON.stringify({mockId:A1_MOCK_2_ID,stage,sectionDeadlineMs:Date.now()+1200000,...extra}));return render(<MemoryRouter><A1FinalMockExamPage mockId={A1_MOCK_2_ID}/></MemoryRouter>);}
beforeEach(()=>{window.scrollTo=jest.fn();});
afterEach(()=>{localStorage.clear();jest.clearAllMocks();});

test('each of 15 Lesen questions owns answer boxes below its statement and saves its choice',()=>{
  mount('lesen');
  const groups=screen.getAllByRole('radiogroup');expect(groups).toHaveLength(15);
  const group=screen.getByRole('radiogroup',{name:'Die Apotheke am Markt ist sonntags geöffnet.'});
  const statement=document.getElementById(group.getAttribute('aria-labelledby'));
  expect(statement.compareDocumentPosition(group)&Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(group.closest('section')).toHaveTextContent('Stadt-Apotheke, Hauptstraße 45.');
  fireEvent.click(within(group).getByLabelText('Falsch'));
  expect(JSON.parse(localStorage.getItem(key)).lesenAnswers['t3-11']).toBe('falsch');
  expect(screen.queryByText(/Der Notdienst ist in der Stadt-Apotheke/)).toBeNull();
});

test('reuses all three Hören Sample 2 parts, including pictures and the unscored example',async()=>{
  expect(A1_MOCK_2_LISTENING.teil1).toBe(A1_EXAM_HOEREN_SAMPLE_2_TEIL1);
  expect(A1_MOCK_2_LISTENING.teil2).toBe(A1_EXAM_HOEREN_SAMPLE_2_TEIL2);
  expect(A1_MOCK_2_LISTENING.teil3).toBe(A1_EXAM_HOEREN_SAMPLE_2_TEIL3);
  mount('hoeren');
  expect(screen.getByText('Wohin fährt der Bus Linie 12 heute?')).toBeVisible();
  expect(screen.getAllByRole('radio')).toHaveLength(45);
  expect(document.querySelectorAll('.a1-practice-picture-frame')).toHaveLength(15);
  await waitFor(()=>expect(screen.getAllByRole('button',{name:'Start audio'})).toHaveLength(3));
  expect(fetchA1ExamHorenAudioPlaybackUrl).toHaveBeenCalledWith(expect.objectContaining({sampleId:'sample-2',part:'teil-3',key:'a1/horen-part-2/teil-3.mp3'}));
});

test('submits the five-field Rossi form and Markus letter as Mock 2, then opens its speaking cards',async()=>{
  scoreA1MockWriting.mockResolvedValue({score:24});
  mount('schreiben',{attemptInfo:{attemptId:'mock2-attempt',attemptNumber:1,firstAttempt:true}});
  const values=['3','Hotel Central, Hauptstraße 14','A1','August','Bar'];
  screen.getAllByRole('textbox').filter(input=>input.tagName==='INPUT').forEach((input,i)=>fireEvent.change(input,{target:{value:values[i]}}));
  fireEvent.change(screen.getByLabelText('Ihre E-Mail'),{target:{value:'Lieber Markus, ich lade dich ein.'}});
  expect(screen.queryByText(/Gartenstraße 8/)).toBeNull();
  fireEvent.click(screen.getByRole('button',{name:'Submit Schreiben → Sprechen'}));
  await waitFor(()=>expect(scoreA1MockWriting).toHaveBeenCalledWith(expect.objectContaining({mockId:A1_MOCK_2_ID,attemptId:'mock2-attempt',formValues:{1:values[0],2:values[1],3:values[2],4:values[3],5:values[4]}})));
  expect(await screen.findByText('Bäckerei')).toBeVisible();
  expect(screen.getByRole('img',{name:'Ein Bleistift'})).toBeVisible();
});

test('ignores progress saved under the wrong mock identity',()=>{
  mount('schreiben',{mockId:'a1-mock-01'});
  expect(screen.queryByLabelText('Ihre E-Mail')).toBeNull();
  expect(screen.getByRole('heading',{name:'A1 Mock 2'})).toBeVisible();
});
