import React from "react";
import Tag from "./tag";
import { Range } from "./range";
import { useAppContext } from "@/state/context";
import { setTableDepth, setTableHeight, setTableWidth } from "@/state/reducer";

export function Sizes() {
  const { dispatch, state } = useAppContext();

  return (
    <div>
      <div className="app_content__box__right  items-center flex-1">
        <div className="flex flex-col gap-3">
          <Tag text="Sizes" />
          <p className="app_content__box__right__category">Choose size</p>

          <Range
            label="Table Width (mm)"
            min={1200}
            max={2400}
            isLoading={state.loading}
            value={state?.width}
            onChange={(value) => {
              dispatch(setTableWidth(value));
            }}
          />

          <Range
            label="Table Depth (mm)"
            min={300}
            max={900}
            isLoading={state.loading}
            value={state?.depth}
            onChange={(value) => {
              dispatch(setTableDepth(value));
            }}
          />

          <Range
            label="Leg Height (mm)"
            min={500}
            max={1200}
            isLoading={state.loading}
            value={state?.height}
            onChange={(value) => {
              dispatch(setTableHeight(value));
            }}
          />
        </div>
      </div>
    </div>
  );
}
