import React from "react";
import { motion } from "framer-motion";
import Tag from "./tag";
import { tableFeetOptions } from "@/lib/utils/static";
import { useAppContext } from "@/state/context";
import { setTableFeet } from "@/state/reducer";

interface IFeetButton {
  text: string;
  onClick?: () => void;
  active?: boolean;
}

function FeetButton(props: IFeetButton) {
  const { text, active = false, onClick } = props;

  return (
    <button type="button" className="app_ui_feet__button" onClick={onClick}>
      <div className="app_ui_feet__button__con">
        <p
          className={`app_ui_feet__button__con__text ${active ? "active" : ""}`}
        >
          {text}
        </p>
      </div>
      {active && (
        <motion.div
          layoutId="app_ui_feet"
          className="app_ui_feet__button__bg"
        ></motion.div>
      )}
    </button>
  );
}

export function Feet() {
  const { state, dispatch } = useAppContext();

  return (
    <div className="app_content__box__right  items-center flex-1 app_ui_feet">
      <div className="flex flex-col gap-3">
        <Tag text="Feet" />
        <p className="app_content__box__right__category">Choose feet</p>

        <div className="flex items-center gap-2">
          {tableFeetOptions.map((item) => (
            <FeetButton
              key={item?.id}
              text={item?.name}
              active={state.feet.value === item?.value}
              onClick={() => {
                dispatch(setTableFeet(item));
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
