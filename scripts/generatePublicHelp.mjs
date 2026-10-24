import { build } from '../web/node_modules/esbuild/lib/main.js';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
// Render the same component used by in-app navigation. No browser runtime is
// needed to read the public help, and content cannot drift between two copies.
const result = await build({
  stdin: {
    contents: `import React from 'react';
      import { renderToStaticMarkup } from 'react-dom/server';
      import Guide from './src/components/PublicStudentGuidePage.js';
      export default renderToStaticMarkup(React.createElement(Guide));`,
    resolveDir: path.join(root, 'web'),
    sourcefile: 'public-help-entry.js',
  },
  bundle: true, platform: 'node', format: 'esm', write: false,
  external: ['react', 'react-dom/server'],
  loader: { '.js': 'jsx' }, define: { 'process.env.NODE_ENV': '"production"' },
});
// Resolve React from the frontend installation, also in a fresh CI checkout.
const require = createRequire(path.join(root, 'web/package.json'));
const source = result.outputFiles[0].text
  .replaceAll('"react"', JSON.stringify(`file://${require.resolve('react')}`))
  .replaceAll('"react-dom/server"', JSON.stringify(`file://${require.resolve('react-dom/server')}`));
const { default: markup } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Falowen Help | Signup, Payments, Courses and Exams</title>
<meta name="description" content="Official Falowen guide to signup, payments, Course Book, Results, live class schedules, full mocks and exam practice levels.">
<link rel="canonical" href="https://www.falowen.app/help">
<meta property="og:title" content="Falowen Help"><meta property="og:url" content="https://www.falowen.app/help">
<style>body{margin:0;color:#172033;background:#f3f4f6}main{box-sizing:border-box}p,li{line-height:1.7}a{overflow-wrap:anywhere}main>section{min-width:0}main section div{min-width:0}@media(max-width:600px){main section div[style*="grid-template-columns"]{grid-template-columns:1fr!important;gap:4px!important}}</style>
</head><body><nav style="padding:16px;font-family:system-ui"><a href="/">Falowen home</a> · <a href="/login/">Log in</a> · <a href="/signup?program=german">Sign up</a></nav>${markup}</body></html>`;
await mkdir(path.join(root, 'web/public'), { recursive: true });
await writeFile(path.join(root, 'web/public/help.html'), html);
console.log('Generated public Help HTML from the shared guide.');
