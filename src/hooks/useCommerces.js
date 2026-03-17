import { useQuery } from '@tanstack/react-query';
import { fetchCommerces } from '../services/catalogService';

export const useCommerces = ({ searchQuery, category }) =>
  useQuery({
    queryKey: ['commerces', { searchQuery, category }],
    queryFn: fetchCommerces,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
    placeholderData: (previousData) => previousData,
  });
