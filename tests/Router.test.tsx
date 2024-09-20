import { screen } from '@testing-library/react';
import { db } from './mocks/db';
import { navigateTo } from './utils';


describe('Router', () => {


  it('should render the homepage for /', () => {
    navigateTo('/');

    expect(screen.getByRole('heading', { name: /home/i })).toBeInTheDocument();
  })
  it('should render the products for /products', () => {
    navigateTo('/products');

    expect(screen.getByRole('heading', { name: /products/i })).toBeInTheDocument();
  })
  it('should render the product details for /products/:id', async () => {
    const product = db.product.create();

    navigateTo('/products/' + product.id);

    expect(await screen.findByRole('heading', { name: product.name })).toBeInTheDocument();

    db.product.delete({
      where: {
        id: {
          equals: product.id
        }
      }
    })
  })
})
