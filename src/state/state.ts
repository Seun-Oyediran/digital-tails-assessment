import { tableTopOptions, tableFeetOptions } from "@/lib/utils/static";

export type TableTopItem = (typeof tableTopOptions)[0];
export type TableFeetItem = (typeof tableFeetOptions)[0];

export const initialAppState = {
  tableTop: tableTopOptions[0],
  feet: tableFeetOptions[0],
  width: 1200,
  depth: 300,
  height: 500,
  defaultWidth: 1200,
  defaultDepth: 300,
  defaultHeight: 500,
  loadingProgress: 0,
  loading: true,
};

export type AppState = typeof initialAppState;
