// Public songs are registered explicitly. Other files in the Swahili folder
// may be private lesson resources.
const tracks = Object.freeze({
  "swahili-a1-day-12": "swahili/music/A1/day-12/Angalia Kalenda.mp3.mpeg",
  "swahili-a1-day-02": "swahili/music/A1/day-02/Salamu, Salamu.mp3",
  "swahili-a1-day-11": "swahili/music/A1/day-11/Dukani.mp3",
  "swahili-b1-day-28": "swahili/music/B1/day-28/Mazingira Huanza Na Mimi.mp3",
  "swahili-a1-day-10": "swahili/music/A1/day-10/Leo Tunaenda Sokoni.mp3",
  "swahili-a1-day-06": "swahili/music/A1/day-06/Chakula Kizuri Mgahawani.mp3",
  "swahili-a1-day-05": "swahili/music/A1/day-05/Karibu Kufahamu Familia Yangu.mp3",
});

const swahiliMusicKey = (id) => Object.hasOwn(tracks, id) ? tracks[id] : "";
const isSwahiliMusicKey = (key) => Object.values(tracks).includes(key);

module.exports = { swahiliMusicKey, isSwahiliMusicKey };
