#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function normalizeText(value) {
  if (!value) return '';
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseCsvLine(line, delimiter = ',') {
  const fields = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      const next = line[i + 1];
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === delimiter && !inQuotes) {
      fields.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  fields.push(current);
  return fields.map((field) => field.trim());
}

function parseCsv(raw, delimiter = ',') {
  const lines = raw
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0);

  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0], delimiter);

  return lines.slice(1).map((line, index) => {
    const values = parseCsvLine(line, delimiter);
    const row = {};

    headers.forEach((header, hIndex) => {
      row[header] = values[hIndex] ?? '';
    });

    row.__rowNumber = index + 2;
    return row;
  });
}

function splitProducts(value) {
  return String(value || '')
    .split(/[|,;]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildSearchIndex(row) {
  const productTerms = splitProducts(row.products).map(normalizeText).join(' ');
  const fieldTerms = [row.name, row.category, row.address, row.city, row.state]
    .map(normalizeText)
    .filter(Boolean)
    .join(' ');

  return [fieldTerms, productTerms].filter(Boolean).join(' ').trim();
}

function parseCoordinate(raw) {
  if (raw === undefined || raw === null || raw === '') return null;
  const normalized = String(raw).replace(',', '.').trim();
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

function validGeolocation(lat, lng) {
  return Number.isFinite(lat) && Number.isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

function fallbackId(row) {
  const base = `${row.name || ''}|${row.address || ''}|${row.city || ''}`;
  return crypto.createHash('sha1').update(base).digest('hex').slice(0, 24);
}

async function upsertCommerce(supabaseUrl, supabaseKey, payload) {
  const url = `${supabaseUrl}/rest/v1/commerces?on_conflict=id`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify([payload]),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`${response.status} ${response.statusText} - ${detail}`);
  }
}

async function main() {
  const csvPathArg = process.argv[2];
  if (!csvPathArg) {
    console.error('Uso: node scripts/import_csv.js <ruta-csv> [delimitador]');
    process.exit(1);
  }

  const csvPath = path.resolve(process.cwd(), csvPathArg);
  const delimiter = process.argv[3] || ',';

  if (!fs.existsSync(csvPath)) {
    console.error(`CSV no encontrado: ${csvPath}`);
    process.exit(1);
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Faltan variables SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY (o SUPABASE_ANON_KEY).');
    process.exit(1);
  }

  const csvRaw = fs.readFileSync(csvPath, 'utf8');
  const rows = parseCsv(csvRaw, delimiter);

  if (!rows.length) {
    console.warn('No hay filas para importar.');
    process.exit(0);
  }

  let successCount = 0;
  let errorCount = 0;

  for (const row of rows) {
    const lat = parseCoordinate(row.lat ?? row.latitude);
    const lng = parseCoordinate(row.lng ?? row.longitude ?? row.lon);

    if (!validGeolocation(lat, lng)) {
      errorCount += 1;
      console.error(`[fila ${row.__rowNumber}] Coordenadas inválidas: lat=${row.lat ?? row.latitude}, lng=${row.lng ?? row.longitude ?? row.lon}`);
      continue;
    }

    const payload = {
      id: row.id || row.objectID || row.object_id || fallbackId(row),
      name: row.name || null,
      category: row.category || null,
      address: row.address || null,
      city: row.city || null,
      state: row.state || null,
      products: splitProducts(row.products),
      search_index: buildSearchIndex(row),
      lat,
      lng,
    };

    try {
      await upsertCommerce(supabaseUrl, supabaseKey, payload);
      successCount += 1;
    } catch (error) {
      errorCount += 1;
      console.error(`[fila ${row.__rowNumber}] Error upsert: ${error.message}`);
    }
  }

  console.log(`Importación finalizada. Éxitos: ${successCount}. Errores: ${errorCount}.`);
}

main().catch((error) => {
  console.error('Error fatal en import_csv:', error.message);
  process.exit(1);
});
