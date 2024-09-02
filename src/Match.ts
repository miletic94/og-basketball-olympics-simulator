import EventEmitter from "events";
import { Team } from "./Team";
import { MatchPair, Pair } from "../types";
import { TeamRepository } from "./TeamRepository";
import { MatchResult } from "./MatchResult";

// TODO: Rename to Match
export class Match extends EventEmitter {
  private result: MatchResult;
  homeTeam: string;
  awayTeam: string;

  constructor(teams: MatchPair, private teamRepo: TeamRepository) {
    super();
    this.homeTeam = teams[0];
    this.awayTeam = teams[1];

    this.result = new MatchResult(
      new Map([
        [this.homeTeam, 0],
        [this.awayTeam, 0],
      ]) as Map<any, any> & { size: 2 },
      false,
      null
    );

    this.registerTeamListeners(
      this.teamRepo.getTeamsByNames([
        this.homeTeam,
        this.awayTeam,
      ]) as Pair<Team>
    );
  }

  private winnerName(): string | null {
    const homeTeamScore = this.result.getTeamScore(this.homeTeam);
    const awayTeamScore = this.result.getTeamScore(this.awayTeam);

    if (homeTeamScore === awayTeamScore) return null;
    if (homeTeamScore > awayTeamScore) return this.homeTeam;
    return this.awayTeam;
  }

  setResult(homeTeamScore: number, awayTeamScore: number, forfeit = false) {
    this.result.setTeamScore(this.homeTeam, homeTeamScore);
    this.result.setTeamScore(this.awayTeam, awayTeamScore);
    this.result.forfeit = forfeit;
    this.result.winner = this.winnerName();
  }

  getResult() {
    return this.result;
  }

  registerTeamListeners(teams: Pair<Team>) {
    teams.forEach((team) => {
      this.on("finish_group_match", team.resolveMatch);
    });
  }

  finishGroupMatch() {
    this.emit("finish_group_match", this.result);
  }
}
