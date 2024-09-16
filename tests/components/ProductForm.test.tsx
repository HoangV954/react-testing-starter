/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Toaster } from 'react-hot-toast'
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
    const onSubmit = vi.fn();

    render(
      <>
        <ProductForm product={product} onSubmit={onSubmit} />
        <Toaster></Toaster>
      </>,
      { wrapper: AllProviders })

    return {
      onSubmit,
      expectErrorToBeInTheDocument: (errMsg: RegExp) => {
        const error = screen.getByRole('alert');
        expect(error).toBeInTheDocument();
        expect(error).toHaveTextContent(errMsg);
      },

      waitForFormToLoad: async () => {
        await screen.findByRole('form');
        const nameInput = screen.getByPlaceholderText(/name/i);
        const priceInput = screen.getByPlaceholderText(/price/i);
        const categoryInput = screen.getByRole('combobox', { name: /category/i });
        const submitBtn = screen.getByRole('button');

        type FormData = {
          [K in keyof Product]: any
        }

        const validData: FormData = {
          id: 1,
          name: 'a',
          price: 1,
          categoryId: category.id
        }

        const fill = async (product: FormData) => { // group action to fill out the form
          const user = userEvent.setup();

          if (product.name !== undefined) {
            await user.type(nameInput, product.name);
          }

          if (product.price !== undefined) {
            await user.type(priceInput, product.price.toString());
          }

          await user.tab(); // fix for radix UI causing warning

          await user.click(categoryInput);
          const options = screen.getAllByRole('option');
          await user.click(options[0]);
          await user.click(submitBtn);
        }

        return {
          nameInput,
          priceInput,
          categoryInput,
          submitBtn,
          fill, validData
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
    const { waitForFormToLoad, expectErrorToBeInTheDocument } = renderForm();

    const form = await waitForFormToLoad();
    await form.fill({ ...form.validData, name })


    expectErrorToBeInTheDocument(errMsg);

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
    const { waitForFormToLoad, expectErrorToBeInTheDocument } = renderForm();

    const form = await waitForFormToLoad();
    await form.fill({ ...form.validData, price })

    expectErrorToBeInTheDocument(errMsg);
  })

  /* Testing form submission */

  it('should call onSubmit with the correct data', async () => {
    const { waitForFormToLoad, onSubmit } = renderForm();

    const form = await waitForFormToLoad();
    await form.fill({ ...form.validData });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...formData } = form.validData
    expect(onSubmit).toHaveBeenCalledWith(formData);

  })


  it('should display a toast if submission fails', async () => {
    const { waitForFormToLoad, onSubmit } = renderForm();
    onSubmit.mockRejectedValue('error')

    const form = await waitForFormToLoad();
    await form.fill({ ...form.validData });

    const toast = await screen.findByRole('status')
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveTextContent(/error/i);

    //screen.debug // if you dont know how to trigger the toast
  })

  it('should disable submit button upon submission', async () => {
    const { waitForFormToLoad, onSubmit } = renderForm();
    onSubmit.mockReturnValue(new Promise(() => { }));

    const form = await waitForFormToLoad();
    await form.fill({ ...form.validData });

    expect(form.submitBtn).toBeDisabled();
  })
  it('should re-enable submit button upon submission', async () => {
    const { waitForFormToLoad, onSubmit } = renderForm();
    onSubmit.mockResolvedValue({});

    const form = await waitForFormToLoad();
    await form.fill({ ...form.validData });

    expect(form.submitBtn).not.toBeDisabled();
  })
})