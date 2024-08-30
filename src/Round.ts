import EventEmitter from "events";
import { Game } from "./Game";

export class Round extends EventEmitter {
  constructor(
    public name: string,
    private weight: number /*This is to later calculate FIBA rankings since rounds have different weights in a formula */,
    private games: Game[]
  ) {
    super();
  }
  addGame(game: Game) {
    this.games.push(game);
  }

  getName() {
    return this.name;
  }
  getWeight() {
    return this.weight;
  }
  getGames() {
    return this.games;
  }
}
