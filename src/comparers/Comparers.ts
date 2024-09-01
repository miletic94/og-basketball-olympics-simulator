import { IComparer } from "../../types";
import { Team } from "../Team";

// TODO: Put comparers in their own files
export class TeamGroupComparer implements IComparer<Team> {
  compare(a: Team, b: Team): number {
    return a.groupStatistics.compareTo(b.groupStatistics);
  }
}

export class TeamFIBARankingComparer implements IComparer<Team> {
  compare(a: Team, b: Team): number {
    return a.fibaRankingStatistics.compareTo(b.fibaRankingStatistics);
  }
}
