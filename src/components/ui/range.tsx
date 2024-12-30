import React, { useEffect, useState } from "react";
import { clamp } from "three/src/math/MathUtils.js";

interface IProps {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (val: number) => void;
}

export function Range(props: IProps) {
  const { label, max, min, value, onChange } = props;
  const [initialValue, setInitialValue] = useState(value);

  useEffect(() => {
    setInitialValue(value);
  }, [value]);

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

            onChange(clamp(value, min, max));
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          className="w-full"
          onChange={(e) => {
            const value = Number(e?.target?.value);
            onChange(value);
          }}
        />
      </div>
    </div>
  );
}
