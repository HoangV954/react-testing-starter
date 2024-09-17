import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import QuantitySelector from '../../src/components/QuantitySelector'
import { Product } from '../../src/entities'
import { CartProvider } from '../../src/providers/CartProvider'

describe('QuantitySelector', () => {
  const renderComponent = () => {
    const product: Product = {
      id: 1,
      name: 'Milk',
      price: 5,
      categoryId: 1
    }

    render(
      <CartProvider>
        <QuantitySelector product={product} />
      </CartProvider>
    )

    const getAddToCartBtn = () => screen.queryByRole('button', {
      name: /add to cart/i
    }); // solution to the re-render problem

    const getQuantityControl = () => ({
      quantity: screen.queryByRole('status'),
      decrementBtn: screen.queryByRole('button', { name: '-' }),
      incrementBtn: screen.queryByRole('button', { name: '+' }),
    });// again, use arrow function because at render these are not on the screen

    const user = userEvent.setup();
    const addToCart = async () => {
      const btn = getAddToCartBtn();
      await user.click(btn!);
    }

    const incrementQuantity = async () => {
      const { incrementBtn } = getQuantityControl();
      await user.click(incrementBtn!);
    }
    const decrementQuantity = async () => {
      const { decrementBtn } = getQuantityControl();
      await user.click(decrementBtn!);
    }

    return {
      getAddToCartBtn,
      getQuantityControl,
      addToCart,
      incrementQuantity,
      decrementQuantity
    }
  }

  it('should render the Add to cart button', () => {
    const { getAddToCartBtn } = renderComponent();

    expect(getAddToCartBtn()).toBeInTheDocument();
  })

  it('should add the product to cart', async () => {
    const { getAddToCartBtn, addToCart, getQuantityControl } = renderComponent();

    await addToCart();

    const { quantity, decrementBtn, incrementBtn } = getQuantityControl();
    expect(quantity).toHaveTextContent('1');

    expect(decrementBtn).toBeInTheDocument();

    expect(incrementBtn).toBeInTheDocument();

    expect(getAddToCartBtn()).not.toBeInTheDocument();
  })

  it('should increment the quantity', async () => {
    const { incrementQuantity, addToCart, getQuantityControl } = renderComponent();

    await addToCart();

    await incrementQuantity(); // Group actions with actions

    const { quantity } = getQuantityControl();
    expect(quantity).toHaveTextContent('2');
  })

  it('should decrement the quantity', async () => {
    const { addToCart, incrementQuantity, decrementQuantity, getQuantityControl } = renderComponent();

    await addToCart();
    const { quantity } = getQuantityControl();
    await incrementQuantity();
    await decrementQuantity();

    expect(quantity).toHaveTextContent('1');
  })

  it('should remove the product from the cart', async () => {
    const { addToCart, decrementQuantity, getQuantityControl, getAddToCartBtn } = renderComponent();

    await addToCart();
    await decrementQuantity();

    const { incrementBtn, quantity } = getQuantityControl();
    expect(quantity).not.toBeInTheDocument();
    expect(incrementBtn).not.toBeInTheDocument();
    // expect(addToCartBtn).toBeInTheDocument();
    // This line will NOT work since as the btn were clicked, the component re-rendered and the addToCartBtn is no longer the same element you initiated at the start of the test (removed)
    expect(getAddToCartBtn()).toBeInTheDocument(); // Now its a function its not an element base on query at certain time anymore
  })
})