import { buildApplicationSupportMessage } from './applicationSupportMessage';

test('an unknown problem stays unknown, even with a stored video', () => {
  const text = buildApplicationSupportMessage({name:'Augustina Tordzro',level:'A1',video:'CFkrrVxhdL4'});
  expect(text).toContain('No error message is currently displayed.');
  expect(text).toContain('I have not described the problem yet.');
  expect(text).not.toMatch(/YouTube|CFkrrVxhdL4|payment failed|network error/);
});

test('reports the current error and student explanation without unrelated data', () => {
  const text = buildApplicationSupportMessage({step:1,error:'That email is already registered.',problem:'I cannot log in.',password:'private',email:'private@example.com'});
  expect(text).toContain('Current step: 1 of 3 — Your account.');
  expect(text).toContain('Error shown: That email is already registered.');
  expect(text).toContain('Help needed: I cannot log in.');
  expect(text).not.toContain('private');
});
