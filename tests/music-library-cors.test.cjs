const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const source = fs.readFileSync('api/music-library.js', 'utf8');
test('public catalog CORS stays identical across origins and cached responses', async () => {
  const module = {exports:{}};
  let calls = 0;
  vm.runInNewContext(source, {module, require:()=>({listMusicTracks:async()=>{calls++;return [{id:'public-song'}];}}), Date, console});
  for (const origin of ['https://admin.falowen.app','https://music.falowen.app','https://other.example',undefined]) {
    const headers={};
    const res={setHeader:(k,v)=>headers[k]=v,status(code){this.code=code;return this;},json(body){this.body=body;return this;}};
    await module.exports({method:'GET',headers:{origin}},res);
    assert.equal(res.code,200);
    assert.equal(res.body.tracks[0].id,'public-song');
    assert.equal(headers.Vary,undefined);
    assert.match(headers['Cache-Control'],/s-maxage=45/);
    assert.equal(headers['Access-Control-Allow-Credentials'],undefined);
    assert.equal(headers['Access-Control-Allow-Origin'], '*');
  }
  assert.equal(calls,1);
});
