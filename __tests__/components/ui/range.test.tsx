import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { Range } from "../../../src/components/ui/range";

describe("Range Component", () => {
  const setup = ({
    label = "Test Range",
    min = 0,
    max = 100,
    value = 50,
    onChange = jest.fn(),
  } = {}) => {
    const utils = render(
      <Range
        label={label}
        min={min}
        max={max}
        value={value}
        onChange={onChange}
      />
    );
    return { ...utils, label, min, max, value, onChange };
  };

  it("renders the component with the correct initial state", () => {
    const { label } = setup();
    expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.getByRole("spinbutton")).toHaveValue(50);
    expect(screen.getByRole("slider")).toHaveValue("50");
    expect(screen.getByRole("spinbutton")).toHaveAttribute("min", "0");
    expect(screen.getByRole("spinbutton")).toHaveAttribute("max", "100");
    expect(screen.getByRole("slider")).toHaveAttribute("min", "0");
    expect(screen.getByRole("slider")).toHaveAttribute("max", "100");
  });

  it("updates the number input value when changed", () => {
    const { onChange } = setup();

    const numberInput = screen.getByRole("spinbutton");

    fireEvent.change(numberInput, { target: { value: 70 } });
    expect(numberInput).toHaveValue(70);

    fireEvent.blur(numberInput);
    expect(onChange).toHaveBeenCalledWith(70);
  });

  it("clamps the number input value to min and max when blurred", () => {
    const { onChange, min, max } = setup();

    const numberInput = screen.getByRole("spinbutton");

    fireEvent.change(numberInput, { target: { value: max + 10 } });
    fireEvent.blur(numberInput);
    expect(numberInput).toHaveValue(max);
    expect(onChange).toHaveBeenCalledWith(max);

    fireEvent.change(numberInput, { target: { value: min - 10 } });
    fireEvent.blur(numberInput);
    expect(numberInput).toHaveValue(min);
    expect(onChange).toHaveBeenCalledWith(min);
  });

  it("updates the range slider value when changed", async () => {
    const { onChange, rerender } = setup();

    const rangeSlider = screen.getByRole("slider");

    fireEvent.change(rangeSlider, { target: { value: 30 } });

    expect(onChange).toHaveBeenCalledWith(30);
    rerender(
      <Range
        label="Updated Range"
        min={0}
        max={100}
        value={30}
        onChange={onChange}
      />
    );

    expect(rangeSlider).toHaveValue("30");
  });

  it("syncs the number input and range slider values", async () => {
    const { onChange, rerender } = setup();

    const numberInput = screen.getByRole("spinbutton");
    const rangeSlider = screen.getByRole("slider");

    // Update number input
    fireEvent.change(numberInput, { target: { value: 40 } });
    fireEvent.blur(numberInput);
    expect(onChange).toHaveBeenCalledWith(40);

    rerender(
      <Range
        label="Updated Range"
        min={0}
        max={100}
        value={40}
        onChange={onChange}
      />
    );

    expect(numberInput).toHaveValue(40);
    expect(rangeSlider).toHaveValue("40");

    // Update range slider
    fireEvent.change(rangeSlider, { target: { value: 60 } });
    expect(onChange).toHaveBeenCalledWith(60);

    rerender(
      <Range
        label="Updated Range"
        min={0}
        max={100}
        value={60}
        onChange={onChange}
      />
    );

    expect(rangeSlider).toHaveValue("60");
    expect(numberInput).toHaveValue(60);
  });
});
