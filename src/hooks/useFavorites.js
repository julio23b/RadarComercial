import { useQuery } from '@tanstack/react-query';
import { fetchFavorites } from '../services/catalogService';

export const useFavorites = (favoriteIds) =>
  useQuery({
    queryKey: ['favorites', favoriteIds],
    queryFn: fetchFavorites,
    enabled: Array.isArray(favoriteIds),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    initialData: [],
  });
