import fs from 'fs';
import path from 'path';

const root = path.resolve(__dirname, '../../..');
const html = fs.readFileSync(path.join(root, 'web/public/help.html'), 'utf8');
test('public help contains usable guidance without a JavaScript runtime', () => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  expect(doc.querySelector('h1').textContent).toBe('Falowen Help & Navigation');
  expect(doc.querySelector('link[rel="canonical"]').href).toBe('https://www.falowen.app/help');
  expect(doc.querySelector('script[src]')).toBeNull();
  for (const route of ['/signup?program=german', '/campus/account?tab=billing', '/campus/results', '/exams/mocks']) {
    expect([...doc.querySelectorAll('a')].some(a => a.getAttribute('href') === route)).toBe(true);
  }
  expect(doc.body.textContent).toContain('11 October 2026');
  expect(doc.body.textContent).toContain('Your Course Book level stays unchanged');
  expect(doc.body.textContent).toContain('Returning from checkout alone does not confirm payment');
});
test('deployment serves help HTML before the SPA fallback and regenerates it at build', () => {
  const config = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
  const routeIndex = config.routes.findIndex(route => route.src === '/help/?');
  expect(routeIndex).toBeGreaterThanOrEqual(0);
  expect(config.routes[routeIndex].dest).toBe('/help.html');
  expect(routeIndex).toBeLessThan(config.routes.findIndex(route => route.src === '/(.*)'));
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'web/package.json'), 'utf8'));
  expect(pkg.scripts.build).toContain('npm run generate:public-help');
});
