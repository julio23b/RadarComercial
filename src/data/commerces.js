import { products } from './products';

export const commerces = products.map((product, index) => ({
  objectID: String(product.id),
  id: product.id,
  name: product.name,
  category: product.category,
  address: 'Tienda La Conquista, Santiago del Estero, AR',
  search_index: `${product.name} ${product.category} ${product.description}`,
  _geoloc: {
    lat: -27.7834,
    lng: -64.2642,
  },
  popularity: Math.max(100 - index * 5, 10),
  price: product.price,
  image: product.image,
  description: product.description,
}));
