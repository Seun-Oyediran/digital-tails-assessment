import { clamp } from "@/lib/utils";
import React, { useState } from "react";

interface IProps {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (val: number) => void;
  isLoading?: boolean;
}

export function Range(props: IProps) {
  const { label, max, min, value, onChange, isLoading } = props;
  const [initialValue, setInitialValue] = useState(value);

  return (
    <div className="w-full app_range flex flex-col gap-1">
      <p className="app_range__title">{label}</p>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={min}
          max={max}
          value={initialValue}
          className="app_range__input"
          onChange={(e) => {
            const value = Number(e?.target?.value);
            if (typeof value !== "number") return;

            setInitialValue(value);
          }}
          onBlur={(e) => {
            const value = Number(e?.target?.value);
            if (typeof value !== "number") return;

            const clampedValue = clamp(value, min, max);

            setInitialValue(clampedValue);
            onChange(clampedValue);
          }}
          disabled={isLoading}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          className="w-full"
          onChange={(e) => {
            const value = Number(e?.target?.value);

            setInitialValue(value);
            onChange(value);
          }}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
