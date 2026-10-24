const {test}=require("node:test");
const assert=require("node:assert/strict");
const {notificationsPaused,currentNotificationStudent}=require("../deletionNotifications");
test("all deletion stages suppress push and reminders, cancellation restores eligibility",()=>{
 for(const status of ["pending","processing","completed"]) assert.equal(notificationsPaused({accountDeletionStatus:status}),true);
 assert.equal(notificationsPaused({notificationsPausedForDeletion:true}),true);
 assert.equal(notificationsPaused({accountDeletionStatus:"cancelled",notificationsPausedForDeletion:false}),false);
 assert.equal(notificationsPaused({}),false);
});
test("a sender rechecks current state instead of using a stale recipient",async()=>{
 let student={messagingToken:"stale",notificationsPausedForDeletion:true};
 const db={collection:()=>({doc:()=>({get:async()=>({exists:true,data:()=>student})})})};
 assert.equal(await currentNotificationStudent(db,"student"),null);
 student={messagingToken:"new",accountDeletionStatus:"cancelled"};
 assert.equal((await currentNotificationStudent(db,"student")).messagingToken,"new");
});
