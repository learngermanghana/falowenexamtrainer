const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const {signature,candidate,fields}=require("./deployFirestoreIndexes.cjs");
const cfg=JSON.parse(fs.readFileSync(path.resolve(__dirname,"../firestore.indexes.json"),"utf8"));
test("Both speaking review query index declarations are reconciled",()=>{
  const idx=cfg.indexes.filter(x=>x.collectionGroup==="liveSpeakExamResults");
  assert.ok(idx.some(x=>fields(x).map(f=>f[0]).join(",")==="uid,source,createdAt"));
  assert.ok(idx.some(x=>fields(x).map(f=>f[0]).join(",")==="uid,source,level,createdAt"));
  for(const x of idx){
    const body=candidate(x);
    assert.equal(body.queryScope,"COLLECTION");
    assert.equal(body.fields.at(-1).order,"DESCENDING");
    assert.deepEqual(JSON.parse(signature(x))[1],fields(x));
  }
});
test("Firestore-generated __name__ field does not create duplicate indexes",()=>{
  const index=cfg.indexes[0],sig=signature(index);
  const server={...index,fields:[...index.fields,{fieldPath:"__name__",order:"DESCENDING"}],state:"READY"};
  assert.equal(signature(server),sig);
});
