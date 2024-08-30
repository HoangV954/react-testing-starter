import { render, screen } from '@testing-library/react'
import ProductDetail from '../../src/components/ProductDetail'
import { products } from '../mocks/data';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

describe('ProductDetail', () => {

  it('should render product detail', async () => {
    render(<ProductDetail productId={1} />);

    expect(await screen.findByText(new RegExp(products[0].name))).toBeInTheDocument();
    expect(await screen.findByText(new RegExp(`${products[0].price}`))).toBeInTheDocument();
  })

  it('should render message if product not found', async () => {// Case for still valid number, but just not found
    server.use(http.get('/products/1', () => HttpResponse.json(null)))
    render(<ProductDetail productId={1} />);
    expect(await screen.findByText(/not found/i)).toBeInTheDocument();
  })

  it('should render an error for invalid id', async () => {// Case for still valid number, but just not found

    render(<ProductDetail productId={100} />);
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  })
})