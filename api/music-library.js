// Public, on-demand discovery of R2 music ONLY. No cron, no Firestore,
// no browser-side R2 credentials and no private Hören exposure.
const { listMusicTracks } = require('../server/musicDiscovery.cjs');
let cache={ expiresAt:0, tracks:null };
module.exports = async function musicLibraryHandler(req,res) {
  res.setHeader('Access-Control-Allow-Origin','https://music.falowen.app');
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Cache-Control','public, max-age=30, s-maxage=45, stale-if-error=60');
  if(req.method !== 'GET') return res.status(405).json({error:'Method not allowed'});
  const now=Date.now();
  if(cache.tracks && now<cache.expiresAt) return res.status(200).json({ok:true,tracks:cache.tracks});
  try{
    const tracks=await listMusicTracks();
    cache={tracks,expiresAt:now+45000};
    return res.status(200).json({ok:true,tracks});
  }catch(error){
    console.warn('Music listing unavailable:',error?.code || error?.message);
    if(cache.tracks) return res.status(200).json({ok:true,tracks:cache.tracks,stale:true});
    return res.status(503).json({ok:false,error:'Music discovery is temporarily unavailable. Published songs remain accessible.'});
  }
};
