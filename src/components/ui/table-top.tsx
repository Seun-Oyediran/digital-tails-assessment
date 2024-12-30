import React from "react";
import Tag from "./tag";
import { Color } from "./color";
import { useAppContext } from "@/state/context";
import { setTableTop } from "@/state/reducer";
import { tableTopOptions } from "@/lib/utils/static";

export function TableTop() {
  const { dispatch, state } = useAppContext();

  return (
    <div>
      <div className="app_content__box__right flex items-center flex-1">
        <div className="flex flex-col gap-3">
          <Tag text="Table Top" />
          <p className="app_content__box__right__category">
            Choose top material
          </p>

          <div className="flex gap-2">
            {tableTopOptions.map((item) => (
              <Color
                key={item.id}
                layoutId="seat-material"
                color={item.value}
                onClick={() => {
                  dispatch(setTableTop(item));
                }}
                activeColor={state?.tableTop?.value}
              />
            ))}
          </div>

          <div className="app_content__box__right__info">
            <h5 className="app_content__box__right__info__title">
              {state?.tableTop?.name}
            </h5>
            {/* <p className="app_content__box__right__info__details"></p> */}
          </div>
        </div>
      </div>
    </div>
  );
}
