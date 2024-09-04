
import { db } from './db';

export const handlers = [
  ...db.product.toHandlers('rest')
  /* http.get('/categories', () => {
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

  }) */
] // Hardcoding data is not recommended 

