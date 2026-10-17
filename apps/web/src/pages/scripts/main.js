'use strict';

// ── Tool index: one source for search, the home grid and recent tools ───────
const TOOLS = [
  { name: 'Test name generator',        url: '/generators/test-name',        tag: 'NAME', icon: 'person', cat: 'Generators', group: 'Personal',         desc: 'Realistic test names, with Indian regional pools.' },
  { name: 'Test email generator',       url: '/generators/test-email',       tag: 'MAIL', icon: 'mail', cat: 'Generators', group: 'Personal',         desc: 'Test email addresses for signup and form testing.' },
  { name: 'Phone number generator',     url: '/generators/test-phone',       tag: 'TEL', icon: 'phone',  cat: 'Generators', group: 'Personal',         desc: 'Formatted test phone numbers for several countries.' },
  { name: 'Full profile generator',     url: '/generators/test-profile',     tag: 'USER', icon: 'person', cat: 'Generators', group: 'Personal',         desc: 'A complete test person with name, contact and address.' },
  { name: 'Test address generator',     url: '/generators/test-address',     tag: 'ADDR', icon: 'pin', cat: 'Generators', group: 'Personal',         desc: 'Test postal addresses for the US, India and the UK.' },
  { name: 'Test address for India',     url: '/generators/test-address-india', tag: 'PIN', icon: 'pin', cat: 'Generators', group: 'Personal',        desc: 'Indian test addresses with PIN codes by state.' },
  { name: 'Credit card generator',      url: '/generators/credit-card',      tag: 'CARD', icon: 'card', cat: 'Generators', group: 'Financial',        desc: 'Luhn-valid test card numbers for payment flows.' },
  { name: 'IBAN generator',             url: '/generators/iban',             tag: 'IBAN', icon: 'bank', cat: 'Generators', group: 'Financial',        desc: 'MOD-97-valid test IBANs for GB, DE and FR.' },
  { name: 'IMEI generator',             url: '/generators/imei',             tag: 'IMEI', icon: 'device', cat: 'Generators', group: 'Device & network', desc: 'Luhn-valid test IMEI numbers, and a validator.' },
  { name: 'IMSI generator',             url: '/generators/imsi',             tag: 'IMSI', icon: 'device', cat: 'Generators', group: 'Device & network', desc: 'Test IMSI numbers with operator MCC-MNC codes.' },
  { name: 'MAC address generator',      url: '/generators/mac-address',      tag: 'MAC', icon: 'network',  cat: 'Generators', group: 'Device & network', desc: 'MAC addresses with real vendor prefixes.' },
  { name: 'IP address generator',       url: '/generators/ip-address',       tag: 'IP', icon: 'globe',   cat: 'Generators', group: 'Device & network', desc: 'IPv4 and IPv6 addresses for network testing.' },
  { name: 'UUID generator',             url: '/generators/uuid',             tag: 'UUID', icon: 'key', cat: 'Generators', group: 'Device & network', desc: 'RFC 4122 UUIDs, v4 and v1, up to 1000 at once.' },
  { name: 'Password generator',         url: '/generators/password',         tag: 'PASS', icon: 'lock', cat: 'Generators', group: 'Other',            desc: 'Strong random passwords, generated in your browser.' },
  { name: 'Lorem ipsum generator',      url: '/generators/lorem-ipsum',      tag: 'TEXT', icon: 'text', cat: 'Generators', group: 'Other',            desc: 'Placeholder paragraphs, sentences, words or lists.' },
  { name: 'Color converter',            url: '/generators/color-converter',  tag: 'HEX', icon: 'palette',  cat: 'Generators', group: 'Other',            desc: 'Convert colours between HEX, RGB and HSL.' },
  { name: 'Unix timestamp converter',   url: '/generators/unix-timestamp',   tag: 'TIME', icon: 'clock', cat: 'Generators', group: 'Other',            desc: 'Convert Unix timestamps to dates and back.' },
  { name: 'JSON formatter',             url: '/formatters/json',             tag: '{ }', icon: 'braces',  cat: 'Formatters', group: 'Formatters',       desc: 'Prettify, minify and validate JSON with line numbers.' },
  { name: 'XML formatter',              url: '/formatters/xml',              tag: '</>', icon: 'tags',  cat: 'Formatters', group: 'Formatters',       desc: 'Format and validate XML documents.' },
  { name: 'JSON to XML',                url: '/converters/json-to-xml',      tag: 'J→X', icon: 'convert',  cat: 'Converters', group: 'Structured data',  desc: 'Convert JSON into well-formed XML.' },
  { name: 'XML to JSON',                url: '/converters/xml-to-json',      tag: 'X→J', icon: 'convert',  cat: 'Converters', group: 'Structured data',  desc: 'Convert XML into JSON.' },
  { name: 'JSON to CSV',                url: '/converters/json-to-csv',      tag: 'J→C', icon: 'table',  cat: 'Converters', group: 'Structured data',  desc: 'Export a JSON array as a CSV spreadsheet.' },
  { name: 'CSV to JSON',                url: '/converters/csv-to-json',      tag: 'C→J', icon: 'table',  cat: 'Converters', group: 'Structured data',  desc: 'Convert CSV rows into a JSON array.' },
  { name: 'Text to JSON',               url: '/converters/text-to-json',     tag: 'T→J', icon: 'text',  cat: 'Converters', group: 'Structured data',  desc: 'Turn key: value lines into JSON.' },
  { name: 'Text to XML',                url: '/converters/text-to-xml',      tag: 'T→X', icon: 'text',  cat: 'Converters', group: 'Structured data',  desc: 'Turn key: value lines into XML.' },
  { name: 'Base64 encoder and decoder', url: '/converters/base64',           tag: 'B64', icon: 'layers',  cat: 'Converters', group: 'Encoding',         desc: 'Encode and decode Base64 text.' },
  { name: 'Hex encoder and decoder',    url: '/converters/hex',              tag: '0x', icon: 'hash',   cat: 'Converters', group: 'Encoding',         desc: 'Convert text to hexadecimal and back.' },
  { name: 'URL encoder and decoder',    url: '/converters/url-encoder',      tag: '%20', icon: 'link',  cat: 'Converters', group: 'Encoding',         desc: 'Percent-encode and decode URLs and query strings.' },
  { name: 'EMI calculator',             url: '/utilities/emi-calculator',    tag: 'EMI', icon: 'calc',  cat: 'Utilities',  group: 'Finance',          desc: 'Monthly loan instalments and total interest.' },
  { name: 'GST calculator',             url: '/utilities/gst-calculator',    tag: 'GST', icon: 'percent',  cat: 'Utilities',  group: 'Finance',          desc: 'Add or remove GST at 5, 12, 18 and 28 percent.' },
  { name: 'SIP calculator',             url: '/utilities/sip-calculator',    tag: 'SIP', icon: 'chart',  cat: 'Utilities',  group: 'Finance',          desc: 'Projected value of a monthly investment plan.' },
];

// Small helper for building HTML from trusted, static strings and tool data.
function esc(s) {
  return String(s).replace(/[&<>"']/g, function(c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

// ── Tool icons: simple stroke glyphs drawn on a 24px grid ──────────────────
var ICONS = {
  person: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/>',
  pin: '<path d="M12 21s7-6.2 7-11.5a7 7 0 10-14 0C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
  bank: '<path d="M3 10l9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 21h18"/>',
  device: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
  network: '<circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v5M12 12l-5 5M12 12l5 5"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3M14 9l2 2"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>',
  text: '<path d="M4 6h16M4 10h16M4 14h10M4 18h13"/>',
  palette: '<circle cx="12" cy="12" r="9"/><circle cx="8" cy="10" r="1.2"/><circle cx="12" cy="7.5" r="1.2"/><circle cx="16" cy="10" r="1.2"/><circle cx="9" cy="15" r="1.2"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  braces: '<path d="M8 4c-2 0-2 2-2 4s0 4-2 4c2 0 2 4 2 4s0 4 2 4M16 4c2 0 2 2 2 4s0 4 2 4c-2 0-2 4-2 4s0 4-2 4"/>',
  tags: '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/>',
  convert: '<path d="M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/>',
  table: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 4v16"/>',
  calc: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 13h.01M13 13h.01M9 17h.01M13 17h.01"/>',
  percent: '<path d="M19 5L5 19"/><circle cx="7" cy="7" r="2"/><circle cx="17" cy="17" r="2"/>',
  chart: '<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>',
  link: '<path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1"/>',
  hash: '<path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5"/>'
};

function toolIcon(tool) {
  var body = ICONS[tool.icon] || ICONS.braces;
  return '<span class="tool-icon" aria-hidden="true"><svg viewBox="0 0 24 24">' + body + '</svg></span>';
}

// ── Theme: the initial value is applied in <head>; this only handles the toggle
(function() {
  var KEY = 'toolpad-theme';
  var btn = document.getElementById('themeToggle');
  if (!btn) return;
  btn.addEventListener('click', function() {
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    var next = dark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    btn.setAttribute('aria-pressed', String(next === 'dark'));
    try { localStorage.setItem(KEY, next); } catch (e) {}
  });
  btn.setAttribute('aria-pressed', String(document.documentElement.getAttribute('data-theme') === 'dark'));
})();

// ── Header menus (hover and focus via CSS; touch and keyboard via .open) ───
(function() {
  var items = document.querySelectorAll('.nav-item');
  items.forEach(function(item) {
    var btn = item.querySelector('.nav-btn');
    if (!btn) return;
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var open = !item.classList.contains('open');
      items.forEach(function(i) { i.classList.remove('open'); });
      item.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });
  document.addEventListener('click', function() {
    items.forEach(function(i) { i.classList.remove('open'); });
    document.querySelectorAll('.nav-btn').forEach(function(b) { b.setAttribute('aria-expanded', 'false'); });
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      items.forEach(function(i) { i.classList.remove('open'); });
    }
  });
})();

// ── Mobile navigation ──────────────────────────────────────────────────────
(function() {
  var toggle = document.querySelector('.nav-toggle');
  var panel = document.getElementById('mobileNav');
  if (!toggle || !panel) return;
  toggle.addEventListener('click', function() {
    var open = panel.hidden;
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
})();

// ── FAQ accordions ─────────────────────────────────────────────────────────
(function() {
  document.querySelectorAll('.faq-q').forEach(function(q) {
    var answer = q.nextElementSibling;
    if (!answer || !answer.classList.contains('faq-a')) return;
    var open = q.getAttribute('aria-expanded') === 'true';
    answer.hidden = !open;
    q.addEventListener('click', function() {
      var nowOpen = q.getAttribute('aria-expanded') !== 'true';
      q.setAttribute('aria-expanded', String(nowOpen));
      answer.hidden = !nowOpen;
      var mark = q.querySelector('.faq-toggle');
      if (mark) mark.textContent = nowOpen ? '−' : '+';
    });
  });
})();

// ── Search: used by the home hero search ───────────────────────────────────
function matchTools(q) {
  var needle = q.trim().toLowerCase();
  if (!needle) return [];
  return TOOLS.filter(function(t) {
    return [t.name, t.tag, t.desc, t.cat, t.group].join(' ').toLowerCase().indexOf(needle) !== -1;
  }).slice(0, 6);
}

(function() {
  var input = document.getElementById('toolSearch');
  var box = document.getElementById('searchResults');
  if (!input || !box) return;

  function render() {
    var q = input.value;
    if (!q.trim()) { box.classList.remove('open'); box.innerHTML = ''; return; }
    var hits = matchTools(q);
    if (!hits.length) {
      box.innerHTML = '<p class="search-empty">No tool matches that search yet.</p>';
    } else {
      box.innerHTML = hits.map(function(t) {
        return '<a class="search-result" href="' + esc(t.url) + '">' +
          toolIcon(t) +
          '<span><span class="sr-name">' + esc(t.name) + '</span><br><span class="sr-cat">' + esc(t.cat) + '</span></span></a>';
      }).join('');
    }
    box.classList.add('open');
  }

  input.addEventListener('input', render);
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') { box.classList.remove('open'); input.blur(); }
  });
  document.addEventListener('click', function(e) {
    if (!box.contains(e.target) && e.target !== input) box.classList.remove('open');
  });
  document.querySelectorAll('[data-q]').forEach(function(b) {
    b.addEventListener('click', function() {
      input.value = b.getAttribute('data-q');
      render();
      input.focus();
    });
  });
  if (window.location.hash === '#search') input.focus();
})();

// ── Home grid with category filter ─────────────────────────────────────────
(function() {
  var grid = document.getElementById('toolGrid');
  if (!grid) return;
  var filterRow = document.getElementById('toolFilters');
  var current = 'All';

  var cats = ['All', 'Generators', 'Formatters', 'Converters', 'Utilities'];
  if (filterRow) {
    filterRow.innerHTML = cats.map(function(c) {
      var count = c === 'All' ? TOOLS.length : TOOLS.filter(function(t) { return t.cat === c; }).length;
      return '<button type="button" class="chip" data-cat="' + c + '" aria-pressed="' + (c === current) + '">' +
        esc(c) + '<span class="chip-count">' + count + '</span></button>';
    }).join('');
  }

  function draw() {
    var list = current === 'All' ? TOOLS : TOOLS.filter(function(t) { return t.cat === current; });
    grid.innerHTML = list.map(function(t) {
      return '<a class="card" href="' + esc(t.url) + '">' +
        toolIcon(t) +
        '<span class="card-cat">' + esc(t.cat) + '</span>' +
        '<h3>' + esc(t.name) + '</h3><p>' + esc(t.desc) + '</p></a>';
    }).join('');
    if (filterRow) {
      filterRow.querySelectorAll('[data-cat]').forEach(function(b) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-cat') === current));
      });
    }
  }

  if (filterRow) {
    filterRow.addEventListener('click', function(e) {
      var b = e.target.closest('[data-cat]');
      if (!b) return;
      current = b.getAttribute('data-cat');
      draw();
    });
  }
  draw();
})();

// ── Category pages: each [data-cat-tools="Name"] container is filled from TOOLS ──
(function() {
  document.querySelectorAll('[data-cat-tools]').forEach(function(box) {
    var cat = box.getAttribute('data-cat-tools');
    var groups = [];
    TOOLS.forEach(function(t) {
      if (t.cat === cat && groups.indexOf(t.group) === -1) groups.push(t.group);
    });
    box.innerHTML = groups.map(function(g) {
      var cards = TOOLS.filter(function(t) { return t.cat === cat && t.group === g; }).map(function(t) {
        return '<a class="card" href="' + esc(t.url) + '">' + toolIcon(t) +
          '<h3>' + esc(t.name) + '</h3><p>' + esc(t.desc) + '</p></a>';
      }).join('');
      return '<h2 class="group-title">' + esc(g) + '</h2>' +
        '<div class="card-grid">' + cards + '</div>';
    }).join('');
  });
})();

// ── Recently used tools (last three visited) ───────────────────────────────
function trackToolVisit(url) {
  try {
    var recent = JSON.parse(localStorage.getItem('toolpad-recent') || '[]');
    var updated = [url].concat(recent.filter(function(u) { return u !== url; })).slice(0, 3);
    localStorage.setItem('toolpad-recent', JSON.stringify(updated));
  } catch (e) {}
}

function renderRecentTools() {
  var container = document.getElementById('recentTools');
  if (!container) return;
  try {
    var recent = JSON.parse(localStorage.getItem('toolpad-recent') || '[]');
    var tools = recent.map(function(url) {
      return TOOLS.find(function(t) { return t.url === url; });
    }).filter(Boolean);
    if (!tools.length) { container.hidden = true; return; }
    container.innerHTML = '<div class="workspace-head" style="border:0;padding:0 0 12px"><span class="card-cat">Recently used</span></div>' +
      '<div class="popular">' + tools.map(function(t) {
        return '<a class="chip" href="' + esc(t.url) + '">' + esc(t.name) + '</a>';
      }).join('') + '</div>';
    container.hidden = false;
  } catch (e) { container.hidden = true; }
}

if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
  trackToolVisit(window.location.pathname);
}
document.addEventListener('DOMContentLoaded', renderRecentTools);
