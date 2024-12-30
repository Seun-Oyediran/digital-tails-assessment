import {
  ActionType,
  AppActions,
  SetTableDepth,
  SetTableFeet,
  SetTableHeight,
  SetTableTop,
  SetTableWidth,
} from "./actions";
import { AppState, TableFeetItem, TableTopItem } from "./state";

export function appReducer(state: AppState, action: AppActions): AppState {
  switch (action.type) {
    case ActionType.SetTableTop:
      return { ...state, tableTop: action.payload };

    case ActionType.SetTableFeet:
      return { ...state, feet: action.payload };

    case ActionType.SetTableWidth:
      return { ...state, width: action.payload };

    case ActionType.SetTableDepth:
      return { ...state, depth: action.payload };

    case ActionType.SetTableHeight:
      return { ...state, height: action.payload };

    default:
      return state;
  }
}

export const setTableTop = (payload: TableTopItem): SetTableTop => {
  return {
    type: ActionType.SetTableTop,
    payload,
  };
};

export const setTableFeet = (payload: TableFeetItem): SetTableFeet => {
  return {
    type: ActionType.SetTableFeet,
    payload,
  };
};

export const setTableWidth = (payload: number): SetTableWidth => {
  return {
    type: ActionType.SetTableWidth,
    payload,
  };
};

export const setTableDepth = (payload: number): SetTableDepth => {
  return {
    type: ActionType.SetTableDepth,
    payload,
  };
};

export const setTableHeight = (payload: number): SetTableHeight => {
  return {
    type: ActionType.SetTableHeight,
    payload,
  };
};
