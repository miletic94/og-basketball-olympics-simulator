import EventEmitter from "events";
import { Team } from "./Team";

//TODO: Move
export type GameResult = {
  homeTeam: string;
  awayTeam: string;
  homeTeamScore: number;
  awayTeamScore: number;
  forfeit: boolean;
};

export type GamePair = [homeTeam: string, awayTeam: string];

export class Game extends EventEmitter {
  private result: GameResult;
  homeTeam: string;
  awayTeam: string;

  constructor(teams: GamePair) {
    super();
    this.homeTeam = teams[0];
    this.awayTeam = teams[1];
    this.result = {
      homeTeam: this.homeTeam,
      awayTeam: this.awayTeam,
      homeTeamScore: 0,
      awayTeamScore: 0,
      forfeit: false,
    };
  }

  setResult(homeTeamScore: number, awayTeamScore: number, forfeit = false) {
    this.result.homeTeamScore = homeTeamScore;
    this.result.awayTeamScore = awayTeamScore;
    this.result.forfeit = forfeit;
  }

  registerTeamListeners(teams: Team[]) {
    teams.forEach((team) => this.on("finish", team.resolveGame));
  }

  getResult() {
    return this.result;
  }

  finishGame() {
    this.emit("finish", this.result);
  }
}
