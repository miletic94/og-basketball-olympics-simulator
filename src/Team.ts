import { FIBARankingStatistics } from "./FIBARankingStatistics";
import { Match } from "./Match";
import type { MatchResult } from "./MatchResult";
import { Round } from "./Round";
import { TeamGroupStatistics } from "./TeamGroupStatistics";
import { TeamRepository } from "./TeamRepository";

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
    fibaRankingPoints: number,
    private teamRepo: TeamRepository
  ) {
    this.name = name;
    this.ISOCode = ISOCode;
    this.group = group;
    this.groupStatistics = new TeamGroupStatistics();
    this.fibaRankingStatistics = new FIBARankingStatistics(
      fibaRankingPoints,
      this.teamRepo
    );
  }

  resolveMatch = (result: MatchResult) => {
    this.groupStatistics.resolveMatch(this.name, result);
  };
  resolveRound = (round: Round) => {
    this.fibaRankingStatistics.resolveRound(this.name, round);
  };
}

// TODO: Move this?
export enum Points {
  WIN_POINTS = 2,
  LOSS_POINTS = 1,
  DRAW_POINTS = 1,
  FORFEIT_POINTS = 0,
}
