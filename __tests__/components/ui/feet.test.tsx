import React from "react";
import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  within,
  waitFor,
} from "@testing-library/react";
import { Feet, FeetButton } from "../../../src/components/ui/feet";
import { useAppContext } from "../../../src/state/context";
import { setTableFeet } from "../../../src/state/reducer";
import { tableFeetOptions } from "@/lib/utils/static";

// Mock the useAppContext hook
jest.mock("../../../src/state/context", () => ({
  useAppContext: jest.fn(),
}));

describe("Feet Component", () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    (useAppContext as jest.Mock).mockReturnValue({
      state: { feet: { ...tableFeetOptions[0] } },
      dispatch,
    });
  });

  it("renders the component with the correct initial state", () => {
    render(<Feet />);

    const button = screen.getByRole("button", { name: /variant 1/i });
    expect(within(button).getByText("Variant 1")).toBeInTheDocument();
  });

  it("dispatches the correct action when a button is clicked", () => {
    render(<Feet />);

    fireEvent.click(screen.getByText("Variant 2"));

    expect(dispatch).toHaveBeenCalledWith(setTableFeet(tableFeetOptions[1]));
  });
});

// Test for the FeetButton component
describe("FeetButton Component", () => {
  it("renders with the correct text and active state", () => {
    const mockOnClick = jest.fn();
    render(
      <FeetButton text="Test Button" active={true} onClick={mockOnClick} />
    );

    expect(screen.getByText("Test Button")).toBeInTheDocument();

    expect(screen.getByText("Test Button")).toHaveClass("active");

    fireEvent.click(screen.getByText("Test Button"));
    expect(mockOnClick).toHaveBeenCalled();
  });
});
