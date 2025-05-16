// src/pages/__tests__/Cart.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import Cart from './Cart';
import { CartContext } from '../components/CartContext';

test('renders empty cart message', () => {
  render(
    <CartContext.Provider value={{ cartItems: [] }}>
      <Cart />
    </CartContext.Provider>
  );

  expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
});

test('renders cart items and total price', () => {
  const mockCartItems = [
    {
      product: { name: 'Bread', current_price: 2.5 },
      quantity: 2,
    },
    {
      product: { name: 'Milk', current_price: 3 },
      quantity: 1,
    },
  ];

  render(
    <CartContext.Provider value={{ cartItems: mockCartItems }}>
      <Cart />
    </CartContext.Provider>
  );

  expect(screen.getByText(/bread/i)).toBeInTheDocument();
  expect(screen.getByText(/milk/i)).toBeInTheDocument();
  expect(screen.getByText(/\$8\.00/)).toBeInTheDocument(); 
});
test('updates quantity on input blur', () => {
  const mockCartItems = [
    {
      product: {
        product_id: 1,
        name: 'Bananas',
        current_price: 1.5,
        image_url: '',
      },
      quantity: 1,
    },
  ];

  const mockRemove = jest.fn();
  const mockUpdateQuantity = jest.fn();

  render(
    <CartContext.Provider
      value={{
        cartItems: mockCartItems,
        removeFromCart: mockRemove,
        updateQuantity: mockUpdateQuantity,
      }}
    >
      <Cart />
    </CartContext.Provider>
  );

  const quantityInput = screen.getByLabelText(/quantity/i);
  fireEvent.change(quantityInput, { target: { value: '3' } });
  fireEvent.blur(quantityInput);

  expect(mockUpdateQuantity).toHaveBeenCalledWith(1, 3);
});

test('displays correct total price', () => {
  const mockCartItems = [
    {
      product: { product_id: 1, name: 'Milk', current_price: 3 },
      quantity: 2,
    },
    {
      product: { product_id: 2, name: 'Bread', current_price: 2.5 },
      quantity: 1,
    },
  ];

  render(
    <CartContext.Provider
      value={{
        cartItems: mockCartItems,
        removeFromCart: jest.fn(),
        updateQuantity: jest.fn(),
      }}
    >
      <Cart />
    </CartContext.Provider>
  );

  expect(screen.getByText(/total: \$8.50/i)).toBeInTheDocument(); // 3*2 + 2.5
});

test('shows Estimate Total button when cart has items', () => {
  const mockCartItems = [
    { product: { product_id: 1, name: 'Cheese', current_price: 5 }, quantity: 1 },
  ];

  render(
    <CartContext.Provider
      value={{
        cartItems: mockCartItems,
        removeFromCart: jest.fn(),
        updateQuantity: jest.fn(),
      }}
    >
      <Cart />
    </CartContext.Provider>
  );

 expect(screen.getByText(/estimate total/i)).toBeInTheDocument();

});
test('updates quantity when Enter is pressed', () => {
  const mockCartItems = [
    {
      product: {
        product_id: 1,
        name: 'Bananas',
        current_price: 1,
        image_url: '',
      },
      quantity: 1,
    },
  ];

  const mockUpdateQuantity = jest.fn();

  render(
    <CartContext.Provider
      value={{
        cartItems: mockCartItems,
        removeFromCart: jest.fn(),
        updateQuantity: mockUpdateQuantity,
      }}
    >
      <Cart />
    </CartContext.Provider>
  );

  const input = screen.getByLabelText(/quantity/i);
  fireEvent.change(input, { target: { value: '4' } });
  fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

  expect(mockUpdateQuantity).toHaveBeenCalledWith(1, 4);
});

