import { algoliasearch } from 'algoliasearch';

export const ALGOLIA_INDEX_NAME = 'commerces';

export type CommerceSearchParams = {
  query: string;
  category?: string | null;
  aroundLatLng?: string;
  aroundRadius?: number;
  filters?: string;
  hitsPerPage?: number;
};

const appId = process.env.EXPO_PUBLIC_ALGOLIA_APP_ID;
const searchApiKey = process.env.EXPO_PUBLIC_ALGOLIA_SEARCH_API_KEY;

let searchClient: ReturnType<typeof algoliasearch> | null = null;

if (appId && searchApiKey) {
  searchClient = algoliasearch(appId, searchApiKey);
}

const toFilterExpression = (category?: string | null, filters?: string) => {
  const categoryFilter = category ? `category:\"${category}\"` : null;
  if (categoryFilter && filters) {
    return `${categoryFilter} AND (${filters})`;
  }
  return categoryFilter || filters;
};

export const searchCommerces = async ({
  query,
  category,
  aroundLatLng,
  aroundRadius,
  filters,
  hitsPerPage = 20,
}: CommerceSearchParams) => {
  if (!searchClient) {
    return [];
  }

  const { results } = await searchClient.search([
    {
      indexName: ALGOLIA_INDEX_NAME,
      query,
      params: {
        hitsPerPage,
        aroundLatLng,
        aroundRadius,
        filters: toFilterExpression(category, filters),
      },
    },
  ]);

  return (results?.[0] as { hits?: Array<Record<string, unknown>> })?.hits ?? [];
};
