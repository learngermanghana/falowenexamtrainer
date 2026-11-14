// Public songs are registered explicitly. Other files in the Swahili folder
// may be private lesson resources.
const tracks = Object.freeze({
  "swahili-a1-day-05": "swahili/A1/day-05/day-05.mp3",
});

const swahiliMusicKey = (id) => Object.hasOwn(tracks, id) ? tracks[id] : "";
const isSwahiliMusicKey = (key) => Object.values(tracks).includes(key);

module.exports = { swahiliMusicKey, isSwahiliMusicKey };
