import React from 'react';
import { createRoot } from 'react-dom/client';
import VisitorQuestionHelper from './components/VisitorQuestionHelper';
if (!document.getElementById('falowen-public-questions')) {
  const mount = document.createElement('div');
  mount.id = 'falowen-public-questions';
  document.body.appendChild(mount);
  createRoot(mount).render(<VisitorQuestionHelper />);
}
