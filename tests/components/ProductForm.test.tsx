import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductForm from '../../src/components/ProductForm'
import { Category, Product } from '../../src/entities'
import AllProviders from '../AllProviders'
import { db } from '../mocks/db'

describe('ProductForm', () => {
  let category: Category;

  beforeAll(() => {
    category = db.category.create();
  })

  afterAll(() => {
    db.category.delete({
      where: {
        id: {
          equals: category.id
        }
      }
    })
  })

  const renderForm = (product?: Product) => {
    render(<ProductForm product={product} onSubmit={vi.fn()} />, { wrapper: AllProviders })

    return {
      waitForFormToLoad: async () => {
        await screen.findByRole('form');
        return {
          nameInput: screen.getByPlaceholderText(/name/i),
          priceInput: screen.getByPlaceholderText(/price/i),
          categoryInput: screen.getByRole('combobox', { name: /category/i }),
          submitBtn: screen.getByRole('button')
        }
      },
      // nameInput: screen.getByPlaceholderText(/name/i)
      // this expression is executed before waitForFormToLoad
    }
  }

  /* Testing rendering */

  it('should render form fields', async () => {
    const { waitForFormToLoad } = renderForm();

    const inputs = await waitForFormToLoad();
    expect(inputs.nameInput).toBeInTheDocument();

    expect(inputs.priceInput).toBeInTheDocument();

    expect(inputs.categoryInput).toBeInTheDocument();
  })

  it('should populate form fields when editing a product', async () => {
    const product: Product = {
      id: 1,
      name: 'Bread',
      price: 10,
      categoryId: category.id
    }
    const { waitForFormToLoad } = renderForm(product);
    await waitForFormToLoad();

    expect(screen.getByPlaceholderText(/name/i)).toHaveValue(product.name);

    expect(screen.getByPlaceholderText(/price/i)).toHaveValue(product.price.toString());

    expect(screen.getByRole('combobox', { name: /category/i })).toHaveTextContent(category.name);
    // Text content is NOT value
  })

  /* Testing focus */
  it('should put focus on the name field', async () => {
    const { waitForFormToLoad } = renderForm();
    const { nameInput } = await waitForFormToLoad();
    expect(nameInput).toHaveFocus();
  })

  /* Testing validation rules */
  /* parameterized test */
  it.each([/* Check zod schema for these reqs */
    {
      scenario: 'missing',
      errMsg: /required/i,
    },
    {
      scenario: 'longer than 255 chars',
      name: 'a'.repeat(256),
      errMsg: /255/i,
    },

  ])('should display an error if name is $scenario', async ({ name, errMsg }) => {
    const { waitForFormToLoad } = renderForm();

    const form = await waitForFormToLoad();

    const user = userEvent.setup();
    if (name !== undefined) {
      await user.type(form.nameInput, name);

    }
    await user.type(form.priceInput, '10');
    await user.click(form.categoryInput);
    const options = screen.getAllByRole('option');
    await user.click(options[0]);
    await user.click(form.submitBtn);

    const error = screen.getByRole('alert');
    expect(error).toBeInTheDocument();
    expect(error).toHaveTextContent(errMsg);

  })
  it.each([
    {
      scenario: 'missing',
      errMsg: /required/i,
    },
    {
      scenario: '0',
      price: 0,
      errMsg: /greater/i,
    },
    {
      scenario: 'negative',
      price: -1,
      errMsg: /1/i,
    },
    {
      scenario: 'greater than 1000',
      price: 1001,
      errMsg: /1000/i,
    },
    {
      scenario: 'not a number',
      price: 'a',
      errMsg: /required/i,
    }

  ])('should display an error if price is $scenario', async ({ price, errMsg }) => {
    const { waitForFormToLoad } = renderForm();

    const form = await waitForFormToLoad();

    const user = userEvent.setup();
    await user.type(form.nameInput, 'a');
    if (price !== undefined) {
      await user.type(form.priceInput, price.toString());

    }
    await user.click(form.categoryInput);
    const options = screen.getAllByRole('option');
    await user.click(options[0]);
    await user.click(form.submitBtn);

    const error = screen.getByRole('alert');
    expect(error).toBeInTheDocument();
    expect(error).toHaveTextContent(errMsg);

  })
})