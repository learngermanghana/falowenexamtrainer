import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { sendVisitorEvent } from '../services/visitorEnquiries';

jest.mock('../services/visitorEnquiries',()=>({sendVisitorEvent:jest.fn(async()=>{})}));
jest.mock('../services/admissionsEngagementService',()=>({trackAdmissionsEngagement:jest.fn(),createAdmissionsRef:()=> 'question_test'}));
import VisitorQuestionHelper from './VisitorQuestionHelper';
import { visitorAnswer, visitorWhatsAppLink } from '../data/visitorQuestions';
import { loadPublicClasses } from '../services/publicClassCatalogService';
jest.mock('../services/publicClassCatalogService',()=>({loadPublicClasses:jest.fn()}));

test('floating helper answers fees locally and hands unknown questions to the existing WhatsApp number',async()=>{
  render(<VisitorQuestionHelper />);
  expect(screen.queryByRole('dialog')).toBeNull();
  fireEvent.click(screen.getByRole('button',{name:/Questions\? Ask us/}));
  fireEvent.click(screen.getByText('Continue without sharing'));
  const input=screen.getByLabelText('Your question');
  expect(input).toHaveFocus();
  fireEvent.click(screen.getByRole('button',{name:'Common questions'}));
  fireEvent.click(screen.getByRole('button',{name:'What are the fees?'}));
  expect(await screen.findByText(/Current tuition per level:/)).toHaveTextContent('A1: GHS 3,000');
  expect(loadPublicClasses).not.toHaveBeenCalled();
  fireEvent.change(input,{target:{value:'Can I bring my dog & cat?'}});
  fireEvent.click(screen.getByRole('button',{name:'Ask',exact:true}));
  const link=await screen.findByRole('link',{name:/Ask our team on WhatsApp/});
  expect(link.href).toBe(visitorWhatsAppLink('Can I bring my dog & cat?'));
  expect(new URL(link.href).hostname).toBe('wa.me');
  expect(new URL(link.href).pathname).toBe('/233205706589');
  fireEvent.keyDown(input,{key:'Escape'});
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(screen.getByRole('button',{name:/Questions\? Ask us/})).toHaveFocus();
});

test('date answers use the current public catalog and are loaded only when requested',async()=>{
  loadPublicClasses.mockResolvedValue([{level:'A1',title:'A1 future class',startDate:'2099-01-05',meetingDays:[{day:'Monday',startTime:'18:00',endTime:'19:00'}],timeZone:'Africa/Accra'}]);
  render(<VisitorQuestionHelper />);
  fireEvent.click(screen.getByRole('button',{name:/Questions\? Ask us/}));
  fireEvent.click(screen.getByText('Continue without sharing'));
  fireEvent.click(screen.getByRole('button',{name:'Common questions'}));
  fireEvent.click(screen.getByRole('button',{name:'When is the next A1 class?'}));
  await waitFor(()=>expect(screen.getByText(/A1 future class: starts/)).toHaveTextContent('Monday 18:00–19:00 (Africa/Accra)'));
});

test('class answers exclude past, hidden, closed, self-learning and wrong-level classes',()=>{
  const rows=[
    {level:'A1',title:'Past',startDate:'2020-01-01'},
    {level:'A1',title:'Hidden',startDate:'2099-01-01',publicVisible:false},
    {level:'A1',title:'Closed',startDate:'2099-01-01',registrationOpen:false},
    {level:'A1',title:'Self',startDate:'2099-01-01',isSelfLearning:true},
    {level:'B1',title:'Other level',startDate:'2099-01-01'},
    {level:'A1',title:'Correct',startDate:'2099-02-01'},
  ];
  const answer=visitorAnswer('Next A1 class?',{classes:rows,now:new Date('2026-11-04T12:00:00Z')});
  expect(answer.text).toMatch(/^Correct:/);
  expect(answer.text).not.toMatch(/Past|Hidden|Closed|Self|Other level/);
  expect(visitorAnswer('Next A2 class?',{classes:rows}).handoff).toBe(true);
  expect(visitorAnswer('C2 fees').handoff).toBe(true);
  expect(visitorAnswer('Can I get a discount on fees?').handoff).toBe(true);
});


test('quick questions stay collapsed until requested, and account help links directly to signup',async()=>{
  render(<VisitorQuestionHelper />);
  fireEvent.click(screen.getByRole('button',{name:/Questions\? Ask us/}));
  fireEvent.click(screen.getByText('Continue without sharing'));
  const input=screen.getByLabelText('Your question');
  expect(input).toHaveFocus();
  expect(screen.queryByRole('button',{name:'What are the fees?'})).toBeNull();
  fireEvent.click(screen.getByRole('button',{name:'Common questions'}));
  expect(screen.getByRole('button',{name:'What are the fees?'})).toBeInTheDocument();
  fireEvent.focus(input);
  expect(screen.queryByRole('button',{name:'What are the fees?'})).toBeNull();
  fireEvent.change(input,{target:{value:'How do I create an account?'}});
  fireEvent.click(screen.getByRole('button',{name:'Ask',exact:true}));
  const signupLink=await screen.findByRole('link',{name:/Create a free account/});
  expect(signupLink.href).toBe('https://www.falowen.app/signup?program=german');
  expect(screen.getByRole('link',{name:/Already registered\? Log in/}).href).toBe('https://www.falowen.app/login/');
  expect(input).toBeInTheDocument();
});


test('registration links remain on the learner site when reached from Exams', () => {
  const answer = visitorAnswer('How do I create an account?', {context: 'exams'});
  expect(new URL(answer.href, 'https://exams.falowen.app').href).toBe('https://www.falowen.app/signup?program=german');
  expect(new URL(answer.alternateHref, 'https://exams.falowen.app').href).toBe('https://www.falowen.app/login/');
});

test('collects an explicitly submitted contact before showing chat',async()=>{
  render(<VisitorQuestionHelper/>);
  fireEvent.click(screen.getByRole('button',{name:/Questions\? Ask us/}));
  expect(screen.queryByLabelText('Your question')).toBeNull();
  fireEvent.change(screen.getByLabelText('Email address'),{target:{value:'learner@example.com'}});
  expect(sendVisitorEvent).not.toHaveBeenCalledWith('contact_submitted',expect.anything(),expect.anything());
  fireEvent.click(screen.getByText('Request follow-up and continue'));
  expect(await screen.findByLabelText('Your question')).toHaveFocus();
  expect(sendVisitorEvent).toHaveBeenCalledWith('contact_submitted','landing',expect.objectContaining({email:'learner@example.com'}));

});

test('dragging the launcher moves it without opening or counting a chat',()=>{
  sessionStorage.clear();
  sendVisitorEvent.mockClear();
  render(<VisitorQuestionHelper/>);
  const button=screen.getByRole('button',{name:/Questions\? Ask us/});
  button.setPointerCapture=jest.fn();
  const pointer=(type,x,y)=>{
    const event=new MouseEvent(type,{bubbles:true,button:0,clientX:x,clientY:y});
    Object.defineProperties(event,{isPrimary:{value:true},pointerId:{value:1}});
    fireEvent(button,event);
  };
  pointer('pointerdown',10,10);
  pointer('pointermove',130,90);
  pointer('pointerup',130,90);
  fireEvent.click(button,{detail:1});
  expect(button.style.left).toBe('120px');
  expect(button.style.top).toBe('80px');
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(sendVisitorEvent).not.toHaveBeenCalled();
  fireEvent.click(button,{detail:0});
  expect(screen.getByRole('dialog')).toBeInTheDocument();
});
