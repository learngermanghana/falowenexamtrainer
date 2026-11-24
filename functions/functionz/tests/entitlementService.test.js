const { courseExpiry, trialRestriction, paidExamGrants } = require('../entitlementService');
const dbFor = grants => ({collection: () => ({where: () => ({get: async () => ({docs: grants.map((g, i) => ({id: String(i), data: () => g}))})})})});
const now = Date.now();
const active = (level, scope) => ({level, scope, status:'active', expiresAtMs: now + 60000});

test('legacy and paid course records preserve their access treatment', () => {
  expect(courseExpiry({level:'A1',paymentStatus:'paid'})).toBeNull();
  expect(courseExpiry({level:'A2',paid:2000})).toBeNull();
  expect(courseExpiry({program:'swahili',level:'A1'})).toBeNull();
});
test('course trial restricts course resources to its enrolled level', async () => {
  const profile={accountType:'course',level:'A2',trialEndsAt:new Date(now + 60000).toISOString()};
  expect(await trialRestriction(dbFor([]), {uid:'u'}, profile, true)).toEqual({level:'A2',course:true});
  expect(await trialRestriction(dbFor([]), {uid:'u'}, profile)).toEqual({level:'A2',course:true});
});
test('exam trial is restricted and paid access retains its existing behavior', async () => {
  const profile={accountType:'exam_only',level:'A1'};
  expect(await trialRestriction(dbFor([active('A1','trial')]), {uid:'u'}, profile)).toEqual({level:'A1',course:false});
  expect(await trialRestriction(dbFor([active('A1','level')]), {uid:'u'}, profile)).toBeNull();
  expect(paidExamGrants([active('A1','trial'),active('A2','level')]).map(x=>x.level)).toEqual(['A2']);
});
