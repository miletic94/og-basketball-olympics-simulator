import EventEmitter from "events";
import { Game } from "./Game";

export class Round extends EventEmitter {
  private games: Game[];
  constructor(games: Game[]) {
    super();
    this.games = games;
  }
  getGames() {
    return this.games;
  }

  playGames() {
    this.games.map((game) => {});
  }
}
