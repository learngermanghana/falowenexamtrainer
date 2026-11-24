import { renderHook, waitFor } from '@testing-library/react';
import { restrictTrialWithServer, useCourseTrialEntitlement } from './courseTrialEntitlement';

jest.mock('../services/backendUrl', () => ({ getBackendUrl: () => '' }));

test('verified server expiry can restrict but cannot expand an existing course trial', () => {
  const trial = {active:true,endsAtMs:2000};
  expect(restrictTrialWithServer(trial,{course:{day1:false}}).active).toBe(false);
  expect(restrictTrialWithServer(trial,{course:{day1:true,trial:true,endsAtMs:1000}}).endsAtMs).toBe(1000);
  expect(restrictTrialWithServer(trial,{course:{day1:true,trial:true,endsAtMs:3000}}).endsAtMs).toBe(2000);
  expect(restrictTrialWithServer(null,{course:{day1:true}})).toBeNull();
});
test('unknown legacy status or an older server preserves the local trial', () => {
  const trial = {active:true,endsAtMs:2000};
  expect(restrictTrialWithServer(trial,{course:{day1:null}})).toBe(trial);
  expect(restrictTrialWithServer(trial,null)).toBe(trial);
});


test('startup is safe without a user or a loaded entitlement', () => {
  const { result, rerender } = renderHook(({user, enabled}) => useCourseTrialEntitlement(user, enabled), {
    initialProps: { user: null, enabled: false },
  });
  expect(result.current).toBeNull();
  const user = { uid: 'student', getIdToken: jest.fn(async () => 'token') };
  rerender({ user, enabled: false });
  expect(result.current).toBeNull();
  rerender({ user: null, enabled: false });
  expect(result.current).toBeNull();
});

test('entitlements follow the signed-in user and clear safely on sign-out', async () => {
  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true, json: async () => ({ entitlements: {course:{day1:true}} }) });
  try {
    const user = { uid: 'student', getIdToken: jest.fn(async () => 'token') };
    const { result, rerender } = renderHook(({current}) => useCourseTrialEntitlement(current, true), { initialProps: { current: user } });
    expect(result.current).toBeNull();
    await waitFor(() => expect(result.current).toEqual({course:{day1:true}}));
    rerender({ current: null });
    expect(result.current).toBeNull();
  } finally { fetchMock.mockRestore(); }
});
