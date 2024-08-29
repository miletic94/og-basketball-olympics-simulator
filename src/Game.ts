import EventEmitter from "events";

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

  getResult() {
    return this.result;
  }

  finishGame() {
    this.emit("finish", this.result);
  }
}
