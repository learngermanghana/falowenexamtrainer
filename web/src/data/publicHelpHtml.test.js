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
  expect(doc.body.textContent).toContain('4 November 2026');
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

test('admissions FAQs are readable, indexable and match structured data', () => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  expect(doc.querySelector('meta[name="robots"]').content).toBe('index,follow');
  const schema = JSON.parse(doc.querySelector('script[type="application/ld+json"]').textContent);
  expect(schema['@type']).toBe('FAQPage');
  expect(schema.mainEntity.length).toBeGreaterThan(20);
  for (const item of schema.mainEntity) {
    expect(doc.body.textContent).toContain(item.name);
    expect(doc.body.textContent).toContain(item.acceptedAnswer.text);
  }
  expect(doc.body.textContent).toContain('24 hours a day');
  expect(doc.body.textContent).toContain('six-month contract');
  expect(doc.body.textContent).toContain('students living abroad');
  expect(doc.body.textContent).toContain('AI as an examiner');
  const markdown = fs.readFileSync(path.join(root, 'web/public/falowen-help.md'), 'utf8');
  for (const item of schema.mainEntity) expect(markdown).toContain(item.acceptedAnswer.text);
});
