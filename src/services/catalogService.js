import { products } from '../data/products';
import { reviews } from '../data/reviews';

const waitWithAbort = (signal, ms) =>
  new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, ms);
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timeout);
        reject(new Error('Request cancelled'));
      },
      { once: true }
    );
  });

export const fetchCommerces = async ({ queryKey, signal }) => {
  const [, params] = queryKey;
  const { searchQuery = '', category = null } = params || {};

  await waitWithAbort(signal, 350);

  const filtered = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !category || product.category === category;
    return matchesSearch && matchesCategory;
  });

  return filtered;
};

export const fetchFavorites = async ({ queryKey }) => {
  const [, favoriteIds] = queryKey;
  return products.filter((product) => favoriteIds.includes(product.id));
};

export const fetchReviews = async ({ queryKey }) => {
  const [, productId] = queryKey;
  return reviews.filter((review) => review.productId === productId);
};
