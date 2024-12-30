import React from "react";
import { TableTop } from "./table-top";
import { Sizes } from "./sizes";
import { Feet } from "./feet";

export function Ui() {
  return (
    <div className="app_ui flex flex-col gap-4">
      <TableTop />
      <div className="app_ui__divider"></div>
      <Sizes />
      <div className="app_ui__divider"></div>
      <Feet />
    </div>
  );
}
