import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { Color } from "../../../src/components/ui/color";
import { motion } from "framer-motion";

// Mock motion.div to avoid animation issues in testing
jest.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: any;
    }) => (
      <div {...props} data-testid="motion-div">
        {children}
      </div>
    ),
  },
}));

describe("Color Component", () => {
  it("renders the button with the correct color and shows the border when active", () => {
    const onClick = jest.fn();
    const color = "#ff0000";
    const activeColor = "#ff0000";
    const layoutId = "test-layout-id";

    render(
      <Color
        color={color}
        activeColor={activeColor}
        onClick={onClick}
        layoutId={layoutId}
      />
    );

    const button = screen.getByRole("button");
    expect(button).toHaveStyle({ background: color });

    const border = screen.getByTestId("motion-div");
    expect(border).toHaveClass("app_category_options__item__border");
    expect(border).toHaveAttribute("layoutid", `app_colors_${layoutId}`);
  });

  it("calls onClick when the button is clicked", () => {
    const onClick = jest.fn();
    const color = "#ff0000";
    const activeColor = "#ff0000";
    const layoutId = "test-layout-id";

    render(
      <Color
        color={color}
        activeColor={activeColor}
        onClick={onClick}
        layoutId={layoutId}
      />
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    // Ensure onClick was called
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not show the border when the color is not active", () => {
    const onClick = jest.fn();
    const color = "#ff0000";
    const activeColor = "#00ff00";
    const layoutId = "test-layout-id";

    render(
      <Color
        color={color}
        activeColor={activeColor}
        onClick={onClick}
        layoutId={layoutId}
      />
    );

    const border = screen.queryByRole("div");
    expect(border).toBeNull();
  });
});
