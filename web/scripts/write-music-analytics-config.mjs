import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// The music site is a static file in public/. Vite does not interpolate HTML env vars there.
// Only this public measurement ID is embedded; the GA4 property ID and reporting auth stay server-side.
const id = String(process.env.MUSIC_GA4_MEASUREMENT_ID || process.env.VITE_MUSIC_GA4_MEASUREMENT_ID || '').trim();
if (id && !/^G-[A-Z0-9]{6,16}$/.test(id)) {
  throw new Error('MUSIC_GA4_MEASUREMENT_ID must be a GA4 Measurement ID such as G-XXXXXXXXXX.');
}
const output = fileURLToPath(new URL('../public/music/analytics-config.js', import.meta.url));
writeFileSync(output, '// Non-secret measurement ID, generated at build.\nwindow.FALOWEN_MUSIC_GA4_ID = ' + JSON.stringify(id) + ';\n');
console.log(id ? 'Public Falowen Music GA4 configuration generated.' : 'Falowen Music GA4 is disabled until MUSIC_GA4_MEASUREMENT_ID is configured.');
