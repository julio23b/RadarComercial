import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchCommerces } from '../../mobile-app/search/algoliaSearch';
import { commerces } from '../data/commerces';

const DEBOUNCE_MS = 350;

const filterLocalCommerces = ({ query, category }) => {
  const normalizedQuery = query.trim().toLowerCase();
  return commerces.filter((commerce) => {
    const matchesQuery =
      !normalizedQuery ||
      commerce.name.toLowerCase().includes(normalizedQuery) ||
      commerce.search_index.toLowerCase().includes(normalizedQuery);
    const matchesCategory = !category || commerce.category === category;

    return matchesQuery && matchesCategory;
  });
};

export const useCommercesSearch = ({ query, category, aroundLatLng, aroundRadius }) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return useQuery({
    queryKey: ['commerces-search', debouncedQuery, category, aroundLatLng, aroundRadius],
    queryFn: async () => {
      const algoliaHits = await searchCommerces({
        query: debouncedQuery,
        category,
        aroundLatLng,
        aroundRadius,
      });

      if (algoliaHits.length > 0) {
        return algoliaHits;
      }

      return filterLocalCommerces({ query: debouncedQuery, category });
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 2,
  });
};
