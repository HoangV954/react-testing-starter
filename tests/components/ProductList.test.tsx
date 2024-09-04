import { render, screen } from '@testing-library/react'
import ProductList from '../../src/components/ProductList'
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import { db } from '../mocks/db';


describe('ProductList', () => {
  const productIds: number[] = []

  beforeAll(() => {
    [1, 2, 3].forEach(() => {
      const product = db.product.create();
      productIds.push(product.id)
    })
  })

  afterAll(() => {
    db.product.deleteMany({
      where: {
        id: {
          in: productIds
        }
      }
    })
  })

  const renderProductList = () => {
    render(<ProductList />)
  }

  it('should render list of products', async () => {
    renderProductList();

    const items = await screen.findAllByRole('listitem')

    expect(items.length).toBeGreaterThan(0);
  })

  it('should render no products available if no product is found ', async () => {
    server.use(http.get('/products', () => HttpResponse.json([])
    ))

    renderProductList();

    const message = await screen.findByText(/no products/i);
    expect(message).toBeInTheDocument();
  })

  it('should render an error when there\'s an error', async () => {
    server.use(http.get('/products', () => HttpResponse.error()));
    renderProductList();

    const message = await screen.findByText(/error/i);
    expect(message).toBeInTheDocument();
  })
})