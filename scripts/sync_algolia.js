#!/usr/bin/env node

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

function parseCoordinate(raw) {
  if (raw === undefined || raw === null || raw === '') return null;
  const normalized = String(raw).replace(',', '.').trim();
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

function validGeolocation(lat, lng) {
  return Number.isFinite(lat) && Number.isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

async function fetchCommerces(supabaseUrl, supabaseKey) {
  const query = 'select=id,name,category,address,search_index,lat,lng';
  const url = `${supabaseUrl}/rest/v1/commerces?${query}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`${response.status} ${response.statusText} - ${detail}`);
  }

  return response.json();
}

async function uploadAlgoliaBatch(appId, adminApiKey, indexName, objects) {
  const url = `https://${appId}.algolia.net/1/indexes/${encodeURIComponent(indexName)}/batch`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'X-Algolia-API-Key': adminApiKey,
      'X-Algolia-Application-Id': appId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: objects.map((body) => ({ action: 'upsertObject', body })),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`${response.status} ${response.statusText} - ${detail}`);
  }

  return response.json();
}

async function main() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  const algoliaAppId = process.env.ALGOLIA_APP_ID;
  const algoliaAdminKey = process.env.ALGOLIA_ADMIN_API_KEY;
  const algoliaIndexName = process.env.ALGOLIA_INDEX_NAME || 'commerces';

  if (!supabaseUrl || !supabaseKey) {
    console.error('Faltan variables SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY (o SUPABASE_ANON_KEY).');
    process.exit(1);
  }

  if (!algoliaAppId || !algoliaAdminKey) {
    console.error('Faltan variables ALGOLIA_APP_ID y ALGOLIA_ADMIN_API_KEY.');
    process.exit(1);
  }

  const commerces = await fetchCommerces(supabaseUrl, supabaseKey);

  let errorCount = 0;
  const objects = [];

  for (const row of commerces || []) {
    const lat = parseCoordinate(row.lat);
    const lng = parseCoordinate(row.lng);

    if (!validGeolocation(lat, lng)) {
      errorCount += 1;
      console.error(`[id ${row.id}] Coordenadas inválidas. lat=${row.lat}, lng=${row.lng}`);
      continue;
    }

    objects.push({
      objectID: String(row.id),
      name: row.name || '',
      category: row.category || '',
      address: row.address || '',
      search_index: normalizeText(row.search_index || `${row.name || ''} ${row.category || ''} ${row.address || ''}`),
      _geoloc: { lat, lng },
    });
  }

  if (!objects.length) {
    console.warn(`No hay objetos válidos para enviar a Algolia. Filas inválidas: ${errorCount}.`);
    process.exit(0);
  }

  const result = await uploadAlgoliaBatch(algoliaAppId, algoliaAdminKey, algoliaIndexName, objects);
  console.log(`Sync completado. Registros enviados: ${objects.length}. Filas inválidas: ${errorCount}. taskID=${result.taskID || 'n/a'}`);
}

main().catch((error) => {
  console.error('Error fatal en sync_algolia:', error.message);
  process.exit(1);
});
