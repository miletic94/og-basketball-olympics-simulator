import EventEmitter from "events";
import type { Team } from "./Team";
import { MatchPair, Pair } from "../types";
import { TeamRepository } from "./TeamRepository";
import { MatchResult } from "./MatchResult";

// TODO: Rename to Match
export class Match extends EventEmitter {
  private result: MatchResult;
  private teams: MatchPair;

  constructor(teams: MatchPair, private teamRepo: TeamRepository) {
    super();
    this.teams = teams;

    this.result = new MatchResult(
      new Map([
        [this.teams[0], 0],
        [this.teams[1], 0],
      ]) as Map<any, any> & { size: 2 },
      false,
      null
    );

    this.registerTeamListeners(
      this.teamRepo.getTeamsByNames([
        this.teams[0],
        this.teams[1],
      ]) as Pair<Team>
    );
  }

  private winnerName(): string | null {
    const homeTeamScore = this.result.getTeamScore(this.teams[0]);
    const awayTeamScore = this.result.getTeamScore(this.teams[1]);

    if (homeTeamScore === awayTeamScore) return null;
    if (homeTeamScore > awayTeamScore) return this.teams[0];
    return this.teams[1];
  }

  setResult(homeTeamScore: number, awayTeamScore: number, forfeit = false) {
    this.result.setTeamScore(this.teams[0], homeTeamScore);
    this.result.setTeamScore(this.teams[1], awayTeamScore);
    this.result.forfeit = forfeit;
    this.result.winner = this.winnerName();
  }

  getResult() {
    return this.result;
  }

  getTeams() {
    return this.teams;
  }

  getTeam(teamName: string) {
    const team = this.getTeams().find((team) => team === teamName);
    // if (!team) throw new Error(`Team with name ${teamName} not found`);
    return team;
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
