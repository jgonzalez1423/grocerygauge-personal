import { render, screen, waitFor } from "@testing-library/react";
import { Home } from "./Home";
import { MemoryRouter } from "react-router-dom";

beforeEach(() => {
  jest.spyOn(global, "fetch").mockImplementation((url) => {
    if (url === "http://localhost:8000/api/products/") {
      return Promise.resolve({
        json: () =>
          Promise.resolve([
            {
              id: 19,
              name: "Banana",
              current_price: 1.25,
              image_url: "",
            },
            {
              id: 90,
              name: "Apple",
              current_price: 2.5,
              image_url: "",
            },
          ]),
      });
    }
    return Promise.reject("Unhandled fetch URL: " + url);
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("renders welcome message", () => {
  render(
    <MemoryRouter>
      <Home searchQuery="" setSearchQuery={() => {}} />
    </MemoryRouter>
  );

  expect(screen.getByText(/welcome to grocerygauge/i)).toBeInTheDocument();
});

test("shows popular picks if no search query", async () => {
  render(
    <MemoryRouter>
      <Home searchQuery="" setSearchQuery={() => {}} />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText(/banana/i)).toBeInTheDocument();
    expect(screen.getByText(/\$1.25/)).toBeInTheDocument();
  });
});

test("filters products based on search query", async () => {
  render(
    <MemoryRouter>
      <Home searchQuery="apple" setSearchQuery={() => {}} />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText(/apple/i)).toBeInTheDocument();
    expect(screen.queryByText(/banana/i)).not.toBeInTheDocument();
  });
});