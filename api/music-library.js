// Public, on-demand discovery of R2 music ONLY. No cron, no Firestore,
// no browser-side R2 credentials and no private Hören exposure.
const { listMusicTracks } = require('../server/musicDiscovery.cjs');
// Server cache avoids repeated R2 listings; the endpoint only returns public music.
let cache={ expiresAt:0, tracks:null };
module.exports = async function musicLibraryHandler(req,res) {
  // This catalog contains only public songs and uses no credentials. Keep
  // CORS identical for every request so shared CDN entries work on both sites.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Cache-Control','public, max-age=120, stale-if-error=120');
  res.setHeader('Vercel-CDN-Cache-Control', 'max-age=120');
  if(req.method !== 'GET') {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Vercel-CDN-Cache-Control', 'no-store');
    return res.status(405).json({error:'Method not allowed'});
  }
  const now=Date.now();
  if(cache.tracks && now<cache.expiresAt) return res.status(200).json({ok:true,tracks:cache.tracks});
  try{
    const tracks=await listMusicTracks();
    cache={tracks,expiresAt:now+120000};
    return res.status(200).json({ok:true,tracks});
  }catch(error){
    console.warn('Music listing unavailable:',error?.code || error?.message);
    // Never cache an error or a stale fallback as a fresh 2-minute catalog.
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Vercel-CDN-Cache-Control', 'no-store');
    if(cache.tracks) return res.status(200).json({ok:true,tracks:cache.tracks,stale:true});
    return res.status(503).json({ok:false,error:'Music discovery is temporarily unavailable. Published songs remain accessible.'});
  }
};
