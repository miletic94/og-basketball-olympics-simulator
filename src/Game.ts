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

export class Game extends EventEmitter {
  private result: GameResult;

  constructor(homeTeam: string, awayTeam: string) {
    super();
    this.result = {
      homeTeam,
      awayTeam,
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
