export type TeamScore = {
  name: string;
  score: number;
};

export enum VictoryMargin {
  ZERO,
  LESS_THAN_TEN,
  TEN_TO_TWENTY,
  MORE_THAN_TWENTY,
  FORFEIT,
}

type BASIS_POINTS_TABLE_TYPE = {
  [U in "winning" | "losing"]: { [K in VictoryMargin]: number };
};

export class PointsCalculator {
  private winningTeamScore: TeamScore;
  private losingTeamScore: TeamScore;
  private victoryMargin: VictoryMargin;

  private BASIS_POINTS_TABLE: BASIS_POINTS_TABLE_TYPE = {
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

  constructor(winningTeamScore: TeamScore, losingTeamScore: TeamScore) {
    this.winningTeamScore = winningTeamScore;
    this.losingTeamScore = losingTeamScore;
    this.victoryMargin = this.getVictoryMargin();
  }

  getWTBasisPoints(): number {
    return this.BASIS_POINTS_TABLE.winning[this.victoryMargin];
  }

  getLTBasisPoints(): number {
    return this.BASIS_POINTS_TABLE.losing[this.victoryMargin];
  }

  getVictoryMargin(): VictoryMargin {
    const margin = this.winningTeamScore.score - this.losingTeamScore.score;

    if (margin < 0)
      throw new Error(`Winning team has fewer points than losing team: 
        [W] ${this.winningTeamScore.name} : ${this.winningTeamScore.score}
        ${this.losingTeamScore.name} : ${this.losingTeamScore.score}`);

    switch (true) {
      case margin === 0:
        return VictoryMargin.ZERO;

      case margin < 10:
        return VictoryMargin.LESS_THAN_TEN;

      case margin >= 10 && margin < 20:
        return VictoryMargin.TEN_TO_TWENTY;

      default:
        return VictoryMargin.MORE_THAN_TWENTY;
    }
  }
}

// TODO: Competition weight (2.0 for Olympics).
// TODO: Round weight (1:1, 2:2, 3:4, 4:6, 5:6); the semi-finals are usually round 3 or 4, while the final is usually round 4 or 5
