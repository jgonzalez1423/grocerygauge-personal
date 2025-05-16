// src/pages/Product.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Product from "./Product";
import { CartContext } from "../components/CartContext";
import { MemoryRouter } from "react-router-dom";

// Mock fetch for product data and graph data
beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url.includes("/api/products/")) {
      return Promise.resolve({
        json: () =>
          Promise.resolve([
            { id: 1, name: "Apple", current_price: 1.99, image_url: "" },
            { id: 2, name: "Banana", current_price: 0.99, image_url: "" },
          ]),
      });
    }
    if (url.includes("/generate-plot")) {
      return Promise.resolve({
        json: () => Promise.resolve({ image: "fakebase64data" }),
      });
    }
    return Promise.reject("Unhandled fetch URL");
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

test("renders product cards", async () => {
  render(
    <MemoryRouter>
      <CartContext.Provider value={{ addToCart: jest.fn() }}>
        <Product searchQuery="" setSearchQuery={() => {}} />
      </CartContext.Provider>
    </MemoryRouter>
  );

  expect(await screen.findByText(/apple/i)).toBeInTheDocument();
  expect(screen.getByText(/banana/i)).toBeInTheDocument();
});

test("filters products based on search query", async () => {
  render(
    <MemoryRouter>
      <CartContext.Provider value={{ addToCart: jest.fn() }}>
        <Product searchQuery="apple" setSearchQuery={() => {}} />
      </CartContext.Provider>
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText(/apple/i)).toBeInTheDocument();
    expect(screen.queryByText(/banana/i)).not.toBeInTheDocument();
  });
});

test("opens product detail modal and shows price graph", async () => {
  render(
    <MemoryRouter>
      <CartContext.Provider value={{ addToCart: jest.fn() }}>
        <Product searchQuery="" setSearchQuery={() => {}} />
      </CartContext.Provider>
    </MemoryRouter>
  );

  const viewButtons = await screen.findAllByText(/view/i);
  fireEvent.click(viewButtons[0]);

  expect(await screen.findByText(/loading price graph/i)).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.getByAltText(/price graph/i)).toBeInTheDocument();
  });
});

test("adds product to cart from modal", async () => {
  const mockAddToCart = jest.fn();
  window.alert = jest.fn();

  render(
    <MemoryRouter>
      <CartContext.Provider value={{ addToCart: mockAddToCart }}>
        <Product searchQuery="" setSearchQuery={() => {}} />
      </CartContext.Provider>
    </MemoryRouter>
  );

  const viewButtons = await screen.findAllByText(/view/i);
  fireEvent.click(viewButtons[0]);

  const addBtn = await screen.findByText(/add to cart/i);
  fireEvent.click(addBtn);

  await waitFor(() => {
    expect(mockAddToCart).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith("Added to cart!");
  });
});
