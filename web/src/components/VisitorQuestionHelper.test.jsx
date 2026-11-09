import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import VisitorQuestionHelper from './VisitorQuestionHelper';
import { visitorAnswer, visitorWhatsAppLink } from '../data/visitorQuestions';
import { loadPublicClasses } from '../services/publicClassCatalogService';
jest.mock('../services/publicClassCatalogService',()=>({loadPublicClasses:jest.fn()}));

test('floating helper answers fees locally and hands unknown questions to the existing WhatsApp number',async()=>{
  render(<VisitorQuestionHelper />);
  expect(screen.queryByRole('dialog')).toBeNull();
  fireEvent.click(screen.getByRole('button',{name:/Questions\? Ask us/}));
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
  expect(signupLink.getAttribute('href')).toBe('/signup?program=german');
  expect(screen.getByRole('link',{name:/Already registered\\? Log in/}).getAttribute('href')).toBe('/login/');
  expect(input).toBeInTheDocument();
});
