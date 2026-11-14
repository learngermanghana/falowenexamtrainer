const { test } = require('node:test');
const assert = require('node:assert/strict');
const { musicTrackFromKey, musicKeyFromAutoId } = require('../server/musicDiscovery.cjs');

for (const folder of ['library', 'day-01', 'day-06']) {
  test('Swahili music round trip in ' + folder, () => {
    for (const name of ['family-song.mp3', 'Familia Yangu (2).mp3']) {
      const key = 'music/swahili/' + folder + '/' + name;
      const track = musicTrackFromKey(key);
      assert.equal(track.language, 'Swahili');
      assert.equal(track.day, folder === 'library' ? null : Number(folder.slice(4)));
      assert.equal(musicKeyFromAutoId(track.id), key);
      assert.equal(track.coursebook, folder !== 'library');
    }
  });
}
test('Swahili music discovery excludes other folders and nested files', () => {
  for (const key of ['swahili/library/song.mp3', 'music/swahili/library/private/song.mp3', 'music/swahili/day-99/song.mp3'])
    assert.equal(musicTrackFromKey(key), null);
});
