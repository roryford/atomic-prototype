// Atomic Tokens — Figma Plugin
// Bidirectional sync between DTCG tokens/primitives.json and Figma Variables.
//
// Import: reads DTCG JSON → creates/updates Variable collections in Figma
// Export: reads Figma Variables → outputs DTCG JSON matching primitives.json schema

figma.showUI(__html__, { width: 440, height: 520, title: 'Atomic Tokens' });

const DTCG_TYPE_PLUGIN_DATA_KEY = 'dtcg-type';
const DTCG_UNIT_PLUGIN_DATA_KEY = 'dtcg-unit';

figma.ui.onmessage = async (msg) => {
  switch (msg.type) {
    case 'import':
      try {
        const summary = await importTokens(msg.tokens);
        figma.ui.postMessage({ type: 'import-done', summary });
      } catch (err) {
        figma.ui.postMessage({ type: 'error', message: err.message });
      }
      break;

    case 'export':
      try {
        const json = JSON.stringify(exportTokens(), null, 2);
        figma.ui.postMessage({ type: 'export-done', json });
      } catch (err) {
        figma.ui.postMessage({ type: 'error', message: err.message });
      }
      break;

    case 'close':
      figma.closePlugin();
      break;
  }
};

// ── Import ────────────────────────────────────────────────────────────────────

async function importTokens(dtcg) {
  const collections = figma.variables.getLocalVariableCollections();
  const existingVars = figma.variables.getLocalVariables();

  let created = 0;
  let updated = 0;

  // Flatten the DTCG token tree into { path: string, type, value }[]
  const flat = flattenTokens(dtcg);

  // Group by collection name (first path segment becomes the collection)
  const groups = {};
  for (const token of flat) {
    const pathSegments = token.path.split('/');
    const group = pathSegments[0];
    const localPath = pathSegments.slice(1).join('/');
    if (!groups[group]) groups[group] = [];
    groups[group].push({
      path: token.path,
      type: token.type,
      value: token.value,
      description: token.description,
      localPath,
    });
  }

  for (const [groupName, tokens] of Object.entries(groups)) {
    let collection = collections.find(c => c.name === groupName);
    if (!collection) {
      collection = figma.variables.createVariableCollection(groupName);
    }
    const modeId = collection.modes[0].modeId;

    for (const token of tokens) {
      const varName = token.path; // full path as variable name
      const figmaType = dtcgTypeToFigma(token.type);
      if (!figmaType) continue;

      let variable = existingVars.find(
        v => v.name === varName && v.variableCollectionId === collection.id
      );

      if (!variable) {
        variable = figma.variables.createVariable(varName, collection, figmaType);
        created++;
      } else {
        updated++;
      }

      const figmaValue = toFigmaValue(token.type, token.value);
      if (figmaValue !== null) {
        variable.setValueForMode(modeId, figmaValue);
      }
      syncTokenMetadata(variable, token);

      if (token.description) {
        variable.description = token.description;
      }
    }
  }

  return { created, updated, total: flat.length };
}

// ── Export ────────────────────────────────────────────────────────────────────

function exportTokens() {
  const collections = figma.variables.getLocalVariableCollections();
  const allVars = figma.variables.getLocalVariables();
  const result = {};

  for (const collection of collections) {
    const modeId = collection.modes[0].modeId;
    const vars = allVars.filter(v => v.variableCollectionId === collection.id);

    for (const variable of vars) {
      const rawValue = variable.valuesByMode[modeId];
      if (rawValue === undefined) continue;

      // Skip alias/reference values for now — export resolved values only
      if (typeof rawValue === 'object' && 'type' in rawValue && rawValue.type === 'VARIABLE_ALIAS') {
        continue;
      }

      const metadata = readTokenMetadata(variable);
      const dtcgType = figmaTypeToDtcg(variable.resolvedType, metadata);
      if (!dtcgType) continue;

      const dtcgValue = fromFigmaValue(variable.resolvedType, rawValue, metadata);
      if (dtcgValue === null) continue;

      const token = { $type: dtcgType, $value: dtcgValue };
      if (variable.description) token.$description = variable.description;

      setNestedPath(result, variable.name.split('/'), token);
    }
  }

  return result;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Walk a DTCG tree and return a flat list of { path, type, value, description } */
function flattenTokens(obj, prefix = '') {
  const tokens = [];
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}/${key}` : key;
    if (value && typeof value === 'object') {
      if ('$type' in value && '$value' in value) {
        tokens.push({
          path,
          type: value.$type,
          value: value.$value,
          description: value.$description,
        });
      } else {
        const nestedTokens = flattenTokens(value, path);
        for (const token of nestedTokens) {
          tokens.push(token);
        }
      }
    }
  }
  return tokens;
}

/** Set a value in a nested object using a path array */
function setNestedPath(obj, pathArr, value) {
  let cur = obj;
  for (let i = 0; i < pathArr.length - 1; i++) {
    if (!cur[pathArr[i]]) cur[pathArr[i]] = {};
    cur = cur[pathArr[i]];
  }
  cur[pathArr[pathArr.length - 1]] = value;
}

function dtcgTypeToFigma(type) {
  if (type === 'color') return 'COLOR';
  if (type === 'dimension' || type === 'number') return 'FLOAT';
  return null;
}

function figmaTypeToDtcg(type, metadata = {}) {
  if (type === 'COLOR') return 'color';
  if (type === 'FLOAT') {
    return metadata.type === 'number' ? 'number' : 'dimension';
  }
  return null;
}

function toFigmaValue(type, value) {
  if (type === 'color') return hexToRgba(value);
  if (type === 'dimension' || type === 'number') {
    const parsed = parseNumericValue(type, value);
    return parsed ? parsed.number : null;
  }
  return null;
}

function fromFigmaValue(figmaType, value, metadata = {}) {
  if (figmaType === 'COLOR') {
    if (typeof value !== 'object' || !('r' in value)) return null;
    return rgbaToHex(value);
  }
  if (figmaType === 'FLOAT') {
    if (typeof value !== 'number') return null;
    if (metadata.type === 'number') return value;

    const unit = metadata.unit || 'px';
    return `${formatNumber(value)}${unit}`;
  }
  return null;
}

function parseNumericValue(type, value) {
  if (type === 'number') {
    if (typeof value === 'number') return { number: value, unit: '' };
    if (typeof value !== 'string') return null;

    const number = Number.parseFloat(value.trim());
    return Number.isFinite(number) ? { number, unit: '' } : null;
  }

  if (type === 'dimension') {
    if (typeof value === 'number') return { number: value, unit: 'px' };
    if (typeof value !== 'string') return null;

    const match = /^(-?(?:\d+|\d*\.\d+))([a-z%]*)$/i.exec(value.trim());
    if (!match) return null;

    const number = Number.parseFloat(match[1]);
    if (!Number.isFinite(number)) return null;

    return {
      number,
      unit: match[2] || 'px',
    };
  }

  return null;
}

function syncTokenMetadata(variable, token) {
  variable.setPluginData(DTCG_TYPE_PLUGIN_DATA_KEY, token.type);

  if (token.type === 'dimension') {
    const parsed = parseNumericValue(token.type, token.value);
    variable.setPluginData(DTCG_UNIT_PLUGIN_DATA_KEY, parsed ? parsed.unit : 'px');
    return;
  }

  variable.setPluginData(DTCG_UNIT_PLUGIN_DATA_KEY, '');
}

function readTokenMetadata(variable) {
  return {
    type: variable.getPluginData(DTCG_TYPE_PLUGIN_DATA_KEY),
    unit: variable.getPluginData(DTCG_UNIT_PLUGIN_DATA_KEY),
  };
}

function hexToRgba(hex) {
  if (typeof hex !== 'string') return null;

  const normalized = hex.trim().replace(/^#/, '');
  if (![3, 4, 6, 8].includes(normalized.length)) return null;

  const expanded = normalized.length <= 4
    ? normalized.split('').map(char => char + char).join('')
    : normalized;

  const [r, g, b, a = 'FF'] = expanded.match(/.{2}/g);
  return {
    r: parseInt(r, 16) / 255,
    g: parseInt(g, 16) / 255,
    b: parseInt(b, 16) / 255,
    a: parseInt(a, 16) / 255,
  };
}

function rgbaToHex({ r, g, b, a = 1 }) {
  const alpha = clampChannel(a);
  const hex = `${channelToHex(r)}${channelToHex(g)}${channelToHex(b)}`;

  if (Math.round(alpha * 255) === 255) {
    return `#${hex}`.toUpperCase();
  }

  return `#${hex}${channelToHex(alpha)}`.toUpperCase();
}

function channelToHex(channel) {
  return Math.round(clampChannel(channel) * 255).toString(16).padStart(2, '0');
}

function clampChannel(channel) {
  return Math.min(1, Math.max(0, typeof channel === 'number' ? channel : 0));
}

function formatNumber(value) {
  return Number.isInteger(value) ? String(value) : String(value);
}
