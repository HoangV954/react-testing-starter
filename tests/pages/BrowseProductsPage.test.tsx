import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import BrowseProducts from '../../src/pages/BrowseProductsPage'
import { Theme } from '@radix-ui/themes'
import { Category, Product } from '../../src/entities'
import { db, getProductsByCategory } from '../mocks/db'
import userEvent from '@testing-library/user-event'
import { CartProvider } from '../../src/providers/CartProvider'
import { simulateDelay, simulateError } from '../utils'
import AllProviders from '../AllProviders'

describe('BrowseProductsPage', () => {

  const categories: Category[] = [];
  const products: Product[] = [];

  beforeAll(() => {
    [1, 2].forEach((item) => {
      const category = db.category.create({ name: `Category ${item}` }); // This is to prevent faker js randomizing into identical categories
      categories.push(category);
      [1, 2].forEach(() => {
        products.push(db.product.create({ categoryId: category.id }));

      })
    })
  })

  // Remember to clear db after testing
  afterAll(() => {
    const categoryIds = categories.map(category => category.id)
    const productIds = products.map(product => product.id)

    db.category.deleteMany({
      where: {
        id: {
          in: categoryIds
        }
      }
    })
    db.product.deleteMany({
      where: {
        id: {
          in: productIds
        }
      }
    })
  })


  /* Loading state tests */

  it('should show a loading skeleton while fetching categories', () => {
    simulateDelay('/categories');

    renderBrowseProducts();
    expect(screen.getByRole('progress-bar', { name: /categories/i })).toBeInTheDocument(); // filter to match aria-label or customed on the element (sometimes 2 divs can gha)
  })

  it('should hide loading skeleton after categories are fetched', async () => {
    const { getCategoriesSkeleton } = renderBrowseProducts();

    await waitForElementToBeRemoved(getCategoriesSkeleton)
  })

  it('should show a loading skeleton while fetching products', () => {
    simulateDelay('/products');
    renderBrowseProducts();
    expect(screen.queryByRole('progress-bar', { name: /products/i })).toBeInTheDocument();
  })

  it('should hide loading skeleton after products are fetched', async () => {
    const { getProductsSkeleton } = renderBrowseProducts();

    await waitForElementToBeRemoved(getProductsSkeleton)
  })

  /* Error handling */

  it('should not render an error if categories cannot be fetched', async () => {
    simulateError('/categories');

    const { getCategoriesSkeleton, getCategoriesCombobox } = renderBrowseProducts();
    await waitForElementToBeRemoved(getCategoriesSkeleton)
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();  /* => This alone leads to false positive. Why? Because error appears asynchronously (after fetching failed), so it will never be in the document before request for data is sent, so now we wait for the loading skeleton to disappear first(see above - meaning the categories are fetched)  */
    /* Also the purpose of this exercise is to lower the critical level of the error warning (remove error when categories invalidly returned, instead just load the whole list of products) */
    expect(getCategoriesCombobox()).not.toBeInTheDocument(); // Pay attention to RUN the code here (because we need the element)
    /* Meaning the select is still functional? combo box shows normally it just fetches all the items */
  })

  it('should render error if products cannot be fetched', async () => {
    simulateError('/products');

    renderBrowseProducts();

    expect(
      await screen.findByText(/error/i)
    ).toBeInTheDocument();


  })

  /* Actual content testing */

  it('should render categories', async () => {


    const { getCategoriesSkeleton, getCategoriesCombobox } = renderBrowseProducts();
    await waitForElementToBeRemoved(getCategoriesSkeleton)

    const comboBox = getCategoriesCombobox();
    expect(comboBox).toBeInTheDocument(); // Typescript will trigger an error because queryByRole can return null

    const user = userEvent.setup();
    await user.click(comboBox!);

    // This combobox has a default of All and separated categories
    expect(screen.getByRole('option', { name: 'All' })).toBeInTheDocument();
    categories.forEach(c => {
      expect(screen.getByRole('option', { name: c.name })).toBeInTheDocument();
    })
  })

  it('should render products', async () => {
    const { getProductsSkeleton } = renderBrowseProducts();

    await waitForElementToBeRemoved(getProductsSkeleton)

    products.forEach(p => {
      expect(screen.getByText(p.name)).toBeInTheDocument();
    })
  })

  /* Test filtering functions */
  it('should filter products by category', async () => {
    const { selectCategory, expectProductsToBeInTheDocument } = renderBrowseProducts();


    const selectedCategory = categories[0];
    await selectCategory(selectedCategory.name);
    const products = getProductsByCategory(selectedCategory.id);
    expectProductsToBeInTheDocument(products);
  })

  it('should render all products if ALL category is selected', async () => {
    // This is not refactored on purpose to see the logic flow of testing/ refactoring
    // See previous test for refactored version 
    const { getCategoriesSkeleton, getCategoriesCombobox } = renderBrowseProducts();

    await waitForElementToBeRemoved(getCategoriesSkeleton);
    const comboBox = getCategoriesCombobox();
    const user = userEvent.setup();
    await user.click(comboBox!);

    // Act
    const option = screen.getByRole('option', {
      name: /all/i
    })
    await user.click(option);

    // Assert
    const products = db.product.getAll();

    const rows = screen.getAllByRole('row');
    // Table has heading so the rows might be + 1 in length
    const dataRows = rows.slice(1);

    expect(dataRows).toHaveLength(products.length);

    products.forEach(product => {
      expect(screen.getByText(product.name)).toBeInTheDocument()
    })
  })

  const renderBrowseProducts = () => {

    render(
      <CartProvider>
        <Theme>
          <BrowseProducts />
        </Theme>
      </CartProvider>
      , { wrapper: AllProviders })

    const getCategoriesSkeleton = () => screen.queryByRole('progress-bar', { name: /categories/i });
    const getProductsSkeleton = () => screen.queryByRole('progress-bar', { name: /products/i });// making sure data is LOADED (loading bar disappeared)
    const getCategoriesCombobox = () => screen.queryByRole('combobox');

    const selectCategory = async (name: RegExp | string) => {
      // Arrange
      await waitForElementToBeRemoved(getCategoriesSkeleton);
      const comboBox = getCategoriesCombobox();
      const user = userEvent.setup();
      await user.click(comboBox!);

      const option = screen.getByRole('option', {
        name
      })
      await user.click(option);
    }

    const expectProductsToBeInTheDocument = (products: Product[]) => {
      // Assert

      const rows = screen.getAllByRole('row');
      // Table has heading so the rows might be + 1 in length
      const dataRows = rows.slice(1);

      expect(dataRows).toHaveLength(products.length);

      products.forEach(product => {
        expect(screen.getByText(product.name)).toBeInTheDocument()
      })
    }

    return {
      getProductsSkeleton,
      getCategoriesSkeleton,
      getCategoriesCombobox,
      selectCategory,
      expectProductsToBeInTheDocument
    }
  }
})