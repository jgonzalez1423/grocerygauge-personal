import { render, screen, fireEvent } from "@testing-library/react";
import About from "./About";

beforeEach(() => {
  jest.spyOn(window, "alert").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("renders mission statement", () => {
  render(<About />);
  expect(screen.getByText(/our mission/i)).toBeInTheDocument();
  expect(
    screen.getByText(/track grocery price inflation/i)
  ).toBeInTheDocument();
});

test("shows contact form fields", () => {
  render(<About />);
  expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
});

test("submits contact form", () => {
  render(<About />);

  fireEvent.change(screen.getByLabelText(/name/i), {
    target: { value: "Test User" },
  });
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: "test@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/message/i), {
    target: { value: "Hello there!" },
  });

  fireEvent.click(screen.getByText(/send message/i));

  expect(window.alert).toHaveBeenCalledWith(
    "Message sent! We’ll get back to you soon."
  );
});

test("prevents form submission when fields are empty", () => {
  render(<About />);
  fireEvent.click(screen.getByText(/send message/i));
});

test("form inputs update correctly", () => {
  render(<About />);
  fireEvent.change(screen.getByPlaceholderText(/enter name/i), {
    target: { value: "Test" },
  });
  fireEvent.change(screen.getByPlaceholderText(/enter email/i), {
    target: { value: "test@email.com" },
  });
  fireEvent.change(screen.getByPlaceholderText(/enter message/i), {
    target: { value: "Hello!" },
  });

  expect(screen.getByDisplayValue("Test")).toBeInTheDocument();
  expect(screen.getByDisplayValue("test@email.com")).toBeInTheDocument();
  expect(screen.getByDisplayValue("Hello!")).toBeInTheDocument();
});

