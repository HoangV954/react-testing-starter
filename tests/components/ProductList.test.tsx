import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { delay, http, HttpResponse } from 'msw';
import ProductList from '../../src/components/ProductList';
import AllProviders from '../AllProviders';
import { db } from '../mocks/db';
import { server } from '../mocks/server';


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
    render(<ProductList />, { wrapper: AllProviders });
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

  it('should render a loading indicator when fetching data', async () => {
    server.use(http.get('/products', async () => {
      await delay();
      return HttpResponse.json([])
    }))

    renderProductList();

    expect(await screen.findByText(/loading/i)).toBeInTheDocument() /* If its not a text but an Image, give it a test-id or role */
  }
  )
  it('should remove the loading indicator after data is fetched', async () => {

    renderProductList();

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))
  })

  it('should remove the loading indicator if data fetching fails', async () => {

    server.use(http.get('/products', () => HttpResponse.error()));
    renderProductList();

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))
  })
})