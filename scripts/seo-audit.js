// Audits the SEO basics of every page under apps/web/src/pages.
// Usage: node scripts/seo-audit.js
// Prints one line per problem and exits with code 1 if any problem is found.

const fs = require('fs');
const path = require('path');

const PAGES = path.join(__dirname, '..', 'apps', 'web', 'src', 'pages');
const SITE = 'https://toolpad.in';

function walk(dir, out) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full, out);
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}

// Maps a file to the URL it is served at (cleanUrls: no .html, no trailing slash).
function urlFor(file) {
  const rel = path.relative(PAGES, file).split(path.sep).join('/').replace(/\.html$/, '');
  if (rel === 'index') return SITE + '/';
  if (rel.endsWith('/index')) return SITE + '/' + rel.slice(0, -'/index'.length);
  return SITE + '/' + rel;
}

function first(re, text) {
  const m = re.exec(text);
  return m ? m[1].trim() : null;
}

const problems = [];
const files = walk(PAGES, []);

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const rel = path.relative(PAGES, file).split(path.sep).join('/');
  const expected = urlFor(file);
  const title = first(/<title>([\s\S]*?)<\/title>/i, html);
  const desc = first(/<meta name="description" content="([^"]*)"/i, html);
  const canonical = first(/<link rel="canonical" href="([^"]+)"/i, html);
  const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
  const lang = first(/<html[^>]*\slang="([^"]+)"/i, html);

  const report = (msg) => problems.push(rel + ': ' + msg);

  if (!title) report('missing <title>');
  else if (title.length > 60) report('title is ' + title.length + ' chars (max 60)');
  if (!desc) report('missing meta description');
  else if (desc.length > 155) report('description is ' + desc.length + ' chars (max 155)');
  if (h1Count !== 1) report('has ' + h1Count + ' <h1> elements (need exactly 1)');
  if (!canonical) report('missing canonical link');
  else if (canonical !== expected) report('canonical is ' + canonical + ', expected ' + expected);
  if (!lang) report('missing lang attribute on <html>');
  if (!/property="og:title"/.test(html)) report('missing og:title');
  if (!/name="twitter:card"/.test(html)) report('missing twitter:card');
}

if (problems.length) {
  console.log(problems.join('\n'));
  console.log('\n' + problems.length + ' problem(s) across ' + files.length + ' pages.');
  process.exitCode = 1;
} else {
  console.log('All ' + files.length + ' pages pass the SEO audit.');
}
