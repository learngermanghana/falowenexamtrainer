import { restrictTrialWithServer } from './courseTrialEntitlement';

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
