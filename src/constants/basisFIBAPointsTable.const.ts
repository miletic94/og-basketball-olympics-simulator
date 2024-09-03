// TODO: Move?
export enum VictoryMargin {
  ZERO,
  LESS_THAN_TEN,
  TEN_TO_TWENTY,
  MORE_THAN_TWENTY,
  FORFEIT,
}

type BasisPointsTableType = {
  [U in "winning" | "losing"]: { [K in VictoryMargin]: number };
};

export const BASIS_POINTS_TABLE: BasisPointsTableType = {
  winning: {
    [VictoryMargin.ZERO]: 500,
    [VictoryMargin.LESS_THAN_TEN]: 700,
    [VictoryMargin.TEN_TO_TWENTY]: 750,
    [VictoryMargin.MORE_THAN_TWENTY]: 800,
    [VictoryMargin.FORFEIT]: 800,
  },
  losing: {
    [VictoryMargin.ZERO]: 500,
    [VictoryMargin.LESS_THAN_TEN]: 300,
    [VictoryMargin.TEN_TO_TWENTY]: 250,
    [VictoryMargin.MORE_THAN_TWENTY]: 200,
    [VictoryMargin.FORFEIT]: 0,
  },
};
