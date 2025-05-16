import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./components/CartContext";
import { Home, TopBar } from "./pages/Home";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import About from "./pages/About";

// Mock global fetch for Product page
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve([
          {
            id: 1,
            name: "Test Product",
            current_price: 4.99,
            image_url: "",
          },
        ]),
    })
  );
});

test("renders Home page by default", () => {
  render(
    <CartProvider>
      <MemoryRouter initialEntries={["/"]}>
        <TopBar searchQuery="" setSearchQuery={() => {}} />
        <Routes>
          <Route path="/" element={<Home searchQuery="" setSearchQuery={() => {}} />} />
        </Routes>
      </MemoryRouter>
    </CartProvider>
  );
  expect(screen.getByText(/welcome to grocerygauge/i)).toBeInTheDocument();
});

test("renders Browse (Product) page", async () => {
  render(
    <CartProvider>
      <MemoryRouter initialEntries={["/browse"]}>
        <Routes>
          <Route path="/browse" element={<Product searchQuery="" setSearchQuery={() => {}} />} />
        </Routes>
      </MemoryRouter>
    </CartProvider>
  );

  await waitFor(() => {
    expect(screen.getByText(/test product/i)).toBeInTheDocument();
    expect(screen.getByText(/view/i)).toBeInTheDocument();
  });
});

test("renders Cart page", () => {
  render(
    <CartProvider>
      <MemoryRouter initialEntries={["/cart"]}>
        <Routes>
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </MemoryRouter>
    </CartProvider>
  );

  const headings = screen.getAllByText(/your cart/i);
  expect(headings.length).toBeGreaterThan(0); // just confirm it renders
});

test("renders About page", () => {
  render(
    <CartProvider>
      <MemoryRouter initialEntries={["/about"]}>
        <Routes>
          <Route path="/about" element={<About />} />
        </Routes>
      </MemoryRouter>
    </CartProvider>
  );
  expect(screen.getByText(/our mission/i)).toBeInTheDocument();
});