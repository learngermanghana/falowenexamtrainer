import { build } from 'esbuild';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { isPublicVisitorPath } from '../src/utils/publicVisitorPaths.js';
// Static brochures and the exams subdomain bypass React's main entry. Bundle
// the SAME helper and dictionary, then add it only to public HTML documents.
export default function publicVisitorHelper() {
  let outputDir;
  return {
    name: 'falowen-public-visitor-helper',
    configResolved(config) { outputDir = resolve(config.root, config.build.outDir); },
    async generateBundle() {
      const result = await build({entryPoints:['src/publicVisitorHelperEntry.jsx'],bundle:true,write:false,minify:true,
        format:'iife',outfile:'visitor-helper.js',jsx:'automatic',define:{'process.env.NODE_ENV':'"production"','process.env':'{}'},loader:{'.js':'jsx'}});
      for (const file of result.outputFiles) this.emitFile({type:'asset',fileName:'visitor-helper.'+(file.path.endsWith('.css')?'css':'js'),source:file.contents});
    },
    async writeBundle() {
      async function visit(directory, prefix = '') {
        for (const entry of await readdir(directory,{withFileTypes:true})) {
          const relative = prefix + entry.name;
          if (entry.isDirectory()) { if (!['assets','campus'].includes(entry.name)) await visit(join(directory,entry.name),relative+'/'); continue; }
          if (!entry.name.endsWith('.html') || relative === 'index.html' || relative.endsWith('/embed.html')) continue;
          const path = relative === 'exams-landing.html' ? '/' : '/'+relative.replace(/\/index\.html$/,'');
          if (!isPublicVisitorPath(path)) continue;
          const filename = join(directory,entry.name);
          const html = await readFile(filename,'utf8');
          if (html.includes('src="/visitor-helper.js"')) continue;
          await writeFile(filename,html.replace(/<\/body>/i,'<link rel="stylesheet" href="/visitor-helper.css"><script defer src="/visitor-helper.js"></script></body>'));
        }
      }
      await visit(outputDir);
    },
  };
}
