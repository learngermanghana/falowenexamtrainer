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

test.each(['A1','A2','B1','B2','C1'])('%s course trial receives Day 1 and the designated paper only', level => {
  const { resolveEntitlements } = require('../entitlementService');
  const { catalogId } = require('../trialExams.json')[level];
  const result = resolveEntitlements({profile:{level,accountType:'course',trialEndsAt:new Date(now + 60000).toISOString()},now});
  expect(result).toMatchObject({home:true,account:true,course:{day1:true,day2Plus:false,trial:true},exam:{paidLevels:[],trial:{level,catalogId}}});
});
test('exam subscriptions never unlock the course and expire on time', () => {
  const { resolveEntitlements } = require('../entitlementService');
  const profile={accountType:'exam_only',level:'A1'};
  expect(resolveEntitlements({profile,grants:[active('A1','level')],now})).toMatchObject({course:{day1:false,day2Plus:false},exam:{paidLevels:['A1'],trial:null}});
  expect(resolveEntitlements({profile,grants:[{...active('A1','trial'),expiresAtMs:now}],now})).toMatchObject({exam:{paidLevels:[],trial:null}});
});
test('paid legacy courses and preserved separate purchases retain their access', () => {
  const { resolveEntitlements } = require('../entitlementService');
  expect(resolveEntitlements({profile:{level:'B1',paymentStatus:'partial',courseEnrollmentPreserved:true},grants:[active('A2','level')],now})).toMatchObject({course:{day1:true,day2Plus:true},exam:{paidLevels:['A2']}});
});

test('access endpoint uses server-owned records and does not derive privileges from unverified email', async () => {
  const handlers={};
  const app={get:(path,fn)=>{handlers[path]=fn;},post:()=>{}};
  const firestore=()=>dbFor([active('A1','trial')]);
  const admin={firestore};
  const student={uid:'u',accountType:'exam_only',level:'A1'};
  const finder=jest.fn(async()=>({snap:{data:()=>student}}));
  require('../mockCommerce').registerMockCommerceRoutes(app,{admin,getAuthedUser:async()=>({uid:'u'}),findStudentByCodeOrEmail:finder});
  const res={status:jest.fn().mockReturnThis(),set:jest.fn().mockReturnThis(),json:jest.fn()};
  await handlers['/mock/access']({},res);
  expect(res.set).toHaveBeenCalledWith('Cache-Control','private, no-store');
  expect(res.json.mock.calls[0][0]).toMatchObject({entitlements:{accountType:'exam_only',course:{day1:false,day2Plus:false},exam:{trial:{catalogId:'a1-final-02'}}}});
  student.uid='different-user';
  await handlers['/mock/access']({},res);
  expect(res.json.mock.calls[1][0].entitlements).toBeUndefined();
});

test('paid exam access does not unlock later course lessons during a full-course trial', () => {
  const { resolveEntitlements } = require('../entitlementService');
  const profile = { accountType:'course',level:'A2',trialEndsAt:new Date(now+60000).toISOString() };
  expect(resolveEntitlements({profile,grants:[active('A2','level')],now})).toMatchObject({course:{day1:true,day2Plus:false},exam:{paidLevels:['A2'],trial:{catalogId:'a2-final-01'}}});
});
test('expired course trials cannot reopen the designated exam or course lessons', () => {
  const { resolveEntitlements } = require('../entitlementService');
  const profile = { accountType:'course',level:'B1',trialEndsAt:new Date(now-1).toISOString() };
  expect(resolveEntitlements({profile,now})).toMatchObject({home:true,account:true,course:{day1:false,day2Plus:false},exam:{paidLevels:[],trial:null}});
});

test('unknown legacy or institutional course access is not mistaken for a confirmed paid course', () => {
  const { resolveEntitlements } = require('../entitlementService');
  expect(resolveEntitlements({profile:{level:'A1',accountType:'course'},now})).toMatchObject({course:{day1:null,day2Plus:null,trial:false}});
  expect(resolveEntitlements({profile:{program:'swahili',level:'A1'},now})).toMatchObject({course:{day1:null,day2Plus:null}});
});
