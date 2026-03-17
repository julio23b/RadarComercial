const { algoliasearch } = require('algoliasearch');

const appId = process.env.ALGOLIA_APP_ID;
const adminApiKey = process.env.ALGOLIA_ADMIN_API_KEY;
const indexName = process.env.ALGOLIA_INDEX_NAME || 'commerces';

if (!appId || !adminApiKey) {
  throw new Error('Definí ALGOLIA_APP_ID y ALGOLIA_ADMIN_API_KEY para configurar el índice.');
}

const client = algoliasearch(appId, adminApiKey);

async function configureIndex() {
  await client.setSettings({
    indexName,
    indexSettings: {
      searchableAttributes: ['name', 'category', 'address', 'search_index'],
      attributesForFaceting: ['filterOnly(category)'],
      customRanking: ['desc(popularity)'],
      ranking: ['words', 'filters', 'typo', 'attribute', 'proximity', 'exact', 'custom'],
      geoloc: true,
      attributesToRetrieve: ['name', 'category', 'address', 'search_index', '_geoloc', 'popularity'],
      aroundLatLngViaIP: false,
    },
  });

  console.log(`Índice ${indexName} configurado correctamente.`);
}

configureIndex().catch((error) => {
  console.error(error);
  process.exit(1);
});
