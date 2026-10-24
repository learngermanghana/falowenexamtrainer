const test = require('node:test');
const assert = require('node:assert/strict');
const {sanitizeWritingCorrections,normalizeTaskPoints}=require('../writingFeedbackNormalization');
test('preserve all distinct AI corrections, including capitalization and long explanations',()=>{
 const items=Array.from({length:12},(_,i)=>({wrong:`Wrong ${i}`,correct:`Right ${i}`,reason:'A useful explanation.'}));
 items.push({wrong:'im gegensatz',correct:'im Gegensatz',reason:'Nouns begin with a capital letter.'});
 assert.equal(sanitizeWritingCorrections(items).length,13);
 assert.deepEqual(sanitizeWritingCorrections(items).at(-1),{...items.at(-1),category:''});
});
test('remove duplicate and unchanged entries without altering actual corrections',()=>{
 const correction={wrong:'ein Termin',correct:'einen Termin',reason:'Accusative masculine.'};
 assert.equal(sanitizeWritingCorrections([correction,correction,{wrong:'correct',correct:'correct'},{wrong:'empty'}]).length,1);
});
test('task feedback only keeps explicit supported statuses',()=>{
 assert.deepEqual(normalizeTaskPoints(),[]);
 assert.equal(normalizeTaskPoints([{label:'Reason',status:'partial',evidence:'Ich kann nicht kommen.',reason:'No reason given.'},{label:'Invented',status:'unknown'}]).length,1);
});
