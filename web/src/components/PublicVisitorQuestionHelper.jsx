import React from 'react';
import { useLocation } from 'react-router-dom';
import VisitorQuestionHelper from './VisitorQuestionHelper';
import { isPublicVisitorPath } from '../utils/publicVisitorPaths';
export default function PublicVisitorQuestionHelper() {
  const { pathname } = useLocation();
  // The existing homepage already owns its helper.
  return pathname === '/' || !isPublicVisitorPath(pathname) ? null : <VisitorQuestionHelper />;
}
