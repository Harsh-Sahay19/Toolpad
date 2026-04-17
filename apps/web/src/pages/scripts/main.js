'use strict';

// ── Tool index for search ──────────────────────────────────────────────────
const TOOLS = [
  { name: 'IMEI generator',           url: '/generators/imei',          icon: '📡', cat: 'Device & Network' },
  { name: 'UUID generator',           url: '/generators/uuid',          icon: '🔑', cat: 'Device & Network' },
  { name: 'MAC address generator',    url: '/generators/mac-address',   icon: '🖧',  cat: 'Device & Network' },
  { name: 'IP address generator',     url: '/generators/ip-address',    icon: '🌐', cat: 'Device & Network' },
  { name: 'IMSI generator',           url: '/generators/imsi',          icon: '📶', cat: 'Device & Network' },
  { name: 'Fake name generator',      url: '/generators/fake-name',     icon: '👤', cat: 'Personal' },
  { name: 'Fake email generator',     url: '/generators/fake-email',    icon: '✉',  cat: 'Personal' },
  { name: 'Phone number generator',   url: '/generators/fake-phone',    icon: '📱', cat: 'Personal' },
  { name: 'Full profile generator',   url: '/generators/fake-profile',  icon: '🪪', cat: 'Personal' },
  { name: 'Credit card generator',    url: '/generators/credit-card',   icon: '💳', cat: 'Financial' },
  { name: 'IBAN generator',           url: '/generators/iban',          icon: '🏦', cat: 'Financial' },
  { name: 'Fake address generator',   url: '/generators/fake-address',  icon: '📍', cat: 'Financial' },
  { name: 'JSON formatter',           url: '/formatters/json',          icon: '{ }', cat: 'Formatter' },
  { name: 'XML formatter',            url: '/formatters/xml',           icon: '</>', cat: 'Formatter' },
  { name: 'JSON to XML converter',    url: '/converters/json-to-xml',   icon: '⇄',  cat: 'Converter' },
  { name: 'XML to JSON converter',    url: '/converters/xml-to-json',   icon: '⇄',  cat: 'Converter' },
  { name: 'JSON to CSV',              url: '/converters/json-to-csv',   icon: '📊', cat: 'Converter' },
  { name: 'CSV to JSON',              url: '/converters/csv-to-json',   icon: '📊', cat: 'Converter' },
  { name: 'Text to JSON',             url: '/converters/text-to-json',  icon: '📝', cat: 'Converter' },
  { name: 'Text to XML',              url: '/converters/text-to-xml',   icon: '📝', cat: 'Converter' },
  { name: 'Base64 encoder/decoder',   url: '/converters/base64',        icon: '🔐', cat: 'Converter' },
  { name: 'Hex encoder/decoder',      url: '/converters/hex',           icon: '🔢', cat: 'Converter' },
  { name: 'DOCX to PDF converter',    url: '/converters/docx-to-pdf',   icon: '📄', cat: 'Converter' },
];

// ── Theme (auto dark 8pm-6am, manual override saved) ──────────────────────
(function() {
  var KEY = 'toolpad-theme';
  var saved = localStorage.getItem(KEY);
  var hour = new Date().getHours();
  var autoDark = (hour >= 20 || hour < 6);
  var theme = saved !== null ? saved : (autoDark ? 'dark' : '');
  if (theme) document.documentElement.setAttribute('data-theme', theme);
  var tog = document.getElementById('themeToggle');
  if (tog) {
    tog.textContent = theme === 'dark' ? '🌙' : '☀';
    tog.addEventListener('click', function() {
      var dark = document.documentElement.getAttribute('data-theme') === 'dark';
      var next = dark ? '' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      tog.textContent = next === 'dark' ? '🌙' : '☀';
      localStorage.setItem(KEY, next);
    });
  }
})();

// ── Nav dropdowns (hover open/close) ──────────────────────────────────────
document.querySelectorAll('.nav-dropdown').forEach(function(dd) {
  var menu = dd.querySelector('.nav-dropdown-menu');
  if (!menu) return;
  var t;
  dd.addEventListener('mouseenter', function() {
    clearTimeout(t);
    document.querySelectorAll('.nav-dropdown-menu').forEach(function(m) { m.style.display = 'none'; });
    menu.style.display = 'block';
  });
  dd.addEventListener('mouseleave', function() {
    t = setTimeout(function() { menu.style.display = 'none'; }, 200);
  });
  menu.addEventListener('mouseenter', function() { clearTimeout(t); });
  menu.addEventListener('mouseleave', function() {
    t = setTimeout(function() { menu.style.display = 'none'; }, 200);
  });
});
document.addEventListener('click', function(e) {
  if (!e.target.closest('.nav-dropdown')) {
    document.querySelectorAll('.nav-dropdown-menu').forEach(function(m) { m.style.display = 'none'; });
  }
});

// ── Search ─────────────────────────────────────────────────────────────────
var searchInput    = document.getElementById('toolSearch');
var searchDropdown = document.getElementById('searchDropdown');

if (searchInput && searchDropdown) {
  searchInput.addEventListener('input', function() {
    var q = searchInput.value.trim().toLowerCase();
    if (!q) { searchDropdown.classList.remove('open'); return; }
    var hits = TOOLS.filter(function(t) {
      return t.name.toLowerCase().includes(q) || t.cat.toLowerCase().includes(q);
    }).slice(0, 8);
    if (!hits.length) { searchDropdown.classList.remove('open'); return; }
    searchDropdown.innerHTML = hits.map(function(t) {
      return '<a class="search-result" href="' + t.url + '">' +
        '<span class="search-result-icon">' + t.icon + '</span>' +
        '<span><strong style="font-size:13px">' + t.name + '</strong>' +
        '<span style="color:var(--slate-l);font-size:11px;margin-left:6px">' + t.cat + '</span></span></a>';
    }).join('');
    searchDropdown.classList.add('open');
  });
  document.addEventListener('mousedown', function(e) {
    if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
      searchDropdown.classList.remove('open');
    }
  });
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') { searchDropdown.classList.remove('open'); searchInput.blur(); }
  });
}

// ── Recently used tools ────────────────────────────────────────────────────
function trackToolVisit(url) {
  try {
    var recent = JSON.parse(localStorage.getItem('toolpad-recent') || '[]');
    var updated = [url].concat(recent.filter(function(u) { return u !== url; })).slice(0, 3);
    localStorage.setItem('toolpad-recent', JSON.stringify(updated));
  } catch(e) {}
}

function renderRecentTools() {
  var container = document.getElementById('recentTools');
  if (!container) return;
  try {
    var recent = JSON.parse(localStorage.getItem('toolpad-recent') || '[]');
    if (!recent.length) { container.style.display = 'none'; return; }
    var tools = recent.map(function(url) { return TOOLS.find(function(t) { return t.url === url; }); }).filter(Boolean);
    if (!tools.length) { container.style.display = 'none'; return; }
    container.innerHTML = '<div class="subsection"><h3 class="subsection-title">Recently used</h3><div class="tool-grid">' +
      tools.map(function(t) {
        return '<a href="' + t.url + '" class="tool-card"><div class="tool-icon">' + t.icon + '</div>' +
          '<div class="tool-info"><h4>' + t.name + '</h4><p>' + t.cat + '</p></div></a>';
      }).join('') + '</div></div>';
    container.style.display = 'block';
  } catch(e) { container.style.display = 'none'; }
}

if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
  trackToolVisit(window.location.pathname);
}
document.addEventListener('DOMContentLoaded', renderRecentTools);
