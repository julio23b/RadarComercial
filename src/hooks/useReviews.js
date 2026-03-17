import { useQuery } from '@tanstack/react-query';
import { fetchReviews } from '../services/catalogService';

export const useReviews = (productId) =>
  useQuery({
    queryKey: ['reviews', productId],
    queryFn: fetchReviews,
    enabled: Boolean(productId),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
    initialData: [],
  });
