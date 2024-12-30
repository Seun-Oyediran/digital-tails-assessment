import { TableFeetItem, TableTopItem } from "./state";

export enum ActionType {
  SetTableTop,
  SetTableWidth,
  SetTableDepth,
  SetTableHeight,
  SetTableFeet,
}

export interface SetTableTop {
  type: ActionType.SetTableTop;
  payload: TableTopItem;
}

export interface SetTableFeet {
  type: ActionType.SetTableFeet;
  payload: TableFeetItem;
}

export interface SetTableWidth {
  type: ActionType.SetTableWidth;
  payload: number;
}

export interface SetTableDepth {
  type: ActionType.SetTableDepth;
  payload: number;
}

export interface SetTableHeight {
  type: ActionType.SetTableHeight;
  payload: number;
}

export type AppActions =
  | SetTableTop
  | SetTableWidth
  | SetTableDepth
  | SetTableHeight
  | SetTableFeet;
