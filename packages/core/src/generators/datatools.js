'use strict';

// ── JSON Formatter ────────────────────────────────────────────────────────────
function formatJSON(input, indent = 2) {
  try {
    const parsed = typeof input === 'string' ? JSON.parse(input) : input;
    return { success: true, output: JSON.stringify(parsed, null, indent), error: null };
  } catch (e) {
    return { success: false, output: null, error: e.message };
  }
}

function minifyJSON(input) {
  try {
    const parsed = typeof input === 'string' ? JSON.parse(input) : input;
    return { success: true, output: JSON.stringify(parsed), error: null };
  } catch (e) {
    return { success: false, output: null, error: e.message };
  }
}

function validateJSON(input) {
  try {
    const parsed = typeof input === 'string' ? JSON.parse(input) : input;
    const keys   = typeof parsed === 'object' && parsed !== null ? Object.keys(parsed).length : 0;
    return { valid: true, type: Array.isArray(parsed) ? 'array' : typeof parsed, keys, error: null };
  } catch (e) {
    return { valid: false, type: null, keys: 0, error: e.message };
  }
}

// ── XML Formatter ─────────────────────────────────────────────────────────────
function formatXML(input) {
  try {
    let indent = 0;
    const lines = input
      .replace(/>\s*</g, '><')
      .split(/(<[^>]+>)/)
      .filter(s => s.trim());

    const result = [];
    for (const token of lines) {
      if (!token.trim()) continue;
      if (token.startsWith('</')) {
        indent = Math.max(0, indent - 1);
        result.push('  '.repeat(indent) + token.trim());
      } else if (token.startsWith('<') && !token.startsWith('<?') && !token.endsWith('/>')) {
        result.push('  '.repeat(indent) + token.trim());
        if (!token.includes('</')) indent++;
      } else {
        result.push('  '.repeat(indent) + token.trim());
      }
    }
    return { success: true, output: result.join('\n'), error: null };
  } catch (e) {
    return { success: false, output: null, error: e.message };
  }
}

function minifyXML(input) {
  try {
    const output = input.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();
    return { success: true, output, error: null };
  } catch (e) {
    return { success: false, output: null, error: e.message };
  }
}

// ── JSON ↔ XML Conversion ─────────────────────────────────────────────────────
function jsonToXML(input, rootTag = 'root') {
  try {
    const obj = typeof input === 'string' ? JSON.parse(input) : input;
    const convert = (val, tag) => {
      if (Array.isArray(val)) return val.map(item => convert(item, tag.replace(/s$/,''))).join('\n');
      if (typeof val === 'object' && val !== null) {
        const inner = Object.entries(val).map(([k, v]) => convert(v, k)).join('\n');
        return `<${tag}>\n${inner}\n</${tag}>`;
      }
      return `<${tag}>${val}</${tag}>`;
    };
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n${convert(obj, rootTag)}`;
    return { success: true, output: xml, error: null };
  } catch (e) {
    return { success: false, output: null, error: e.message };
  }
}

function xmlToJSON(input) {
  try {
    // Simple XML to JSON (for non-namespace, non-attribute-heavy XML)
    const tagRegex = /<(\w+)>([\s\S]*?)<\/\1>/g;
    const parse = str => {
      const obj = {};
      let match;
      while ((match = tagRegex.exec(str)) !== null) {
        const [, key, val] = match;
        const nested = parse(val);
        obj[key] = Object.keys(nested).length ? nested : val.trim();
      }
      return obj;
    };
    const stripped = input.replace(/<\?xml[^>]*\?>/,'').trim();
    const parsed = parse(stripped);
    return { success: true, output: JSON.stringify(parsed, null, 2), error: null };
  } catch (e) {
    return { success: false, output: null, error: e.message };
  }
}

// ── JSON / XML from plain text ────────────────────────────────────────────────
/**
 * Converts a key:value plain text block into JSON or XML.
 * Input format:
 *   name: John Doe
 *   age: 30
 *   email: john@example.com
 */
function textToJSON(input) {
  try {
    const lines = input.split('\n').filter(l => l.includes(':'));
    const obj   = {};
    for (const line of lines) {
      const idx = line.indexOf(':');
      const key = line.slice(0, idx).trim().replace(/\s+/g,'_');
      const val = line.slice(idx + 1).trim();
      const num = Number(val);
      obj[key]  = !isNaN(num) && val !== '' ? num : val;
    }
    return { success: true, output: JSON.stringify(obj, null, 2), error: null };
  } catch (e) {
    return { success: false, output: null, error: e.message };
  }
}

function textToXML(input, rootTag = 'record') {
  try {
    const jsonResult = textToJSON(input);
    if (!jsonResult.success) throw new Error(jsonResult.error);
    return jsonToXML(jsonResult.output, rootTag);
  } catch (e) {
    return { success: false, output: null, error: e.message };
  }
}

// ── JSON ↔ CSV ────────────────────────────────────────────────────────────────
function jsonToCSV(input) {
  try {
    const arr = typeof input === 'string' ? JSON.parse(input) : input;
    if (!Array.isArray(arr) || !arr.length) throw new Error('Input must be a non-empty JSON array');
    const headers = Object.keys(arr[0]);
    const rows    = arr.map(row => headers.map(h => {
      const v = row[h] ?? '';
      return typeof v === 'string' && (v.includes(',') || v.includes('"')) ? `"${v.replace(/"/g,'""')}"` : v;
    }).join(','));
    return { success: true, output: [headers.join(','), ...rows].join('\n'), error: null };
  } catch (e) {
    return { success: false, output: null, error: e.message };
  }
}

function csvToJSON(input) {
  try {
    const lines   = input.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const rows    = lines.slice(1).map(line => {
      const vals = line.split(',');
      return Object.fromEntries(headers.map((h,i) => [h, isNaN(vals[i]) ? (vals[i]||'').trim() : Number(vals[i])]));
    });
    return { success: true, output: JSON.stringify(rows, null, 2), error: null };
  } catch (e) {
    return { success: false, output: null, error: e.message };
  }
}

// ── Base64 ────────────────────────────────────────────────────────────────────
function encodeBase64(input) {
  try { return { success: true, output: Buffer.from(input,'utf8').toString('base64'), error: null }; }
  catch (e) { return { success: false, output: null, error: e.message }; }
}
function decodeBase64(input) {
  try { return { success: true, output: Buffer.from(input,'base64').toString('utf8'), error: null }; }
  catch (e) { return { success: false, output: null, error: e.message }; }
}

// ── Hex ───────────────────────────────────────────────────────────────────────
function encodeHex(input) {
  try { return { success: true, output: Buffer.from(input,'utf8').toString('hex'), error: null }; }
  catch (e) { return { success: false, output: null, error: e.message }; }
}
function decodeHex(input) {
  try { return { success: true, output: Buffer.from(input.replace(/\s/g,''),'hex').toString('utf8'), error: null }; }
  catch (e) { return { success: false, output: null, error: e.message }; }
}

module.exports = {
  formatJSON, minifyJSON, validateJSON,
  formatXML, minifyXML,
  jsonToXML, xmlToJSON,
  textToJSON, textToXML,
  jsonToCSV, csvToJSON,
  encodeBase64, decodeBase64,
  encodeHex, decodeHex,
};
