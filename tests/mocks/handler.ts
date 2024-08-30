import { http, HttpResponse } from 'msw';
import { products } from './data';

export const handlers = [
  http.get('/categories', () => {
    return HttpResponse.json([
      { id: 1, name: 'Music' },
      { id: 2, name: 'Books' },
      { id: 3, name: 'Gaming' },
    ])
  }),
  http.get('/products', () => {
    return HttpResponse.json([
      { id: 1, name: 'RTX 3060' },
      { id: 2, name: 'RTX 4060' },
      { id: 3, name: 'RTX Titan' },
    ])
  }),
  http.get('/products/:id', ({ params }) => {
    const { id } = params;

    const product = products.find(p => p.id === Number(id));
    if (!product) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(product);

  })
]