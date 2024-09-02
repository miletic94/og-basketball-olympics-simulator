import { FIBARankingStatistics } from "./FIBARankingStatistics";
import type { MatchResult } from "./MatchResult";
import { TeamGroupStatistics } from "./TeamGroupStatistics";

export class Team {
  name: string;
  ISOCode: string;
  group: string;
  groupStatistics: TeamGroupStatistics;
  fibaRankingStatistics: FIBARankingStatistics;

  constructor(
    name: string,
    ISOCode: string,
    group: string,
    fibaRankingPoints: number
  ) {
    this.name = name;
    this.ISOCode = ISOCode;
    this.group = group;
    // TODO: This could be injected (DI)
    this.groupStatistics = new TeamGroupStatistics();
    this.fibaRankingStatistics = new FIBARankingStatistics(fibaRankingPoints);
  }

  resolveMatch = (result: MatchResult) => {
    this.groupStatistics.resolveMatch(this.name, result);
  };
}

// TODO: Move this?
export enum Points {
  WIN_POINTS = 2,
  LOSS_POINTS = 1,
  DRAW_POINTS = 1,
  FORFEIT_POINTS = 0,
}
