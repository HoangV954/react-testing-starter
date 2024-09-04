import { render, screen } from '@testing-library/react'
import ProductDetail from '../../src/components/ProductDetail'
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';
import { db } from '../mocks/db';

describe('ProductDetail', () => {

  let productId: number;


  beforeAll(() => {
    const product = db.product.create();
    productId = product.id
    // mock only 1 product
  })

  afterAll(() => {
    db.product.deleteMany({
      where: {
        id: {
          equals: productId
        }
      }
    })
  })



  it('should render product details', async () => {
    const product = db.product.findFirst({
      where: {
        id: {
          equals: productId
        }
      }
    });

    render(<ProductDetail productId={productId} />);

    expect(await screen.findByText(new RegExp(product!.name))).toBeInTheDocument();
    expect(await screen.findByText(new RegExp(`${product!.price}`))).toBeInTheDocument();
  })

  it('should render message if product not found', async () => {// Case for still valid number, but just not found
    server.use(http.get('/products/1', () => HttpResponse.json(null)))
    render(<ProductDetail productId={1} />);
    expect(await screen.findByText(/not found/i)).toBeInTheDocument();
  })

  it('should render an error for invalid id', async () => {// Case for still valid number, but just not found
    server.use(http.get('/products/1', () => HttpResponse.error()));
    render(<ProductDetail productId={1} />);
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  })
})