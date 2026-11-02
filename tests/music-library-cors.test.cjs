const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const source = fs.readFileSync('api/music-library.js', 'utf8');
test('Admin and Music can read fresh and cached catalogs; other origins are excluded', async () => {
  const module = {exports:{}};
  let calls = 0;
  vm.runInNewContext(source, {module, require:()=>({listMusicTracks:async()=>{calls++;return [{id:'public-song'}];}}), Date, console});
  for (const origin of ['https://admin.falowen.app','https://music.falowen.app','https://other.example',undefined]) {
    const headers={};
    const res={setHeader:(k,v)=>headers[k]=v,status(code){this.code=code;return this;},json(body){this.body=body;return this;}};
    await module.exports({method:'GET',headers:{origin}},res);
    assert.equal(res.code,200);
    assert.equal(res.body.tracks[0].id,'public-song');
    assert.equal(headers.Vary,'Origin');
    assert.equal(headers['Access-Control-Allow-Origin'], ['https://admin.falowen.app','https://music.falowen.app'].includes(origin)?origin:undefined);
  }
  assert.equal(calls,1);
});
