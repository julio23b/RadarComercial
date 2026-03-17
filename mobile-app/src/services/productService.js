import { products } from '../data/products';

export { products };

export const getProducts = () => products;
export const getProductsByCategory = (category) =>
  products.filter((product) => product.category === category);
