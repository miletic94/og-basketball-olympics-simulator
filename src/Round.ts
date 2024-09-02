import EventEmitter from "events";
import { Match } from "./Match";

export class Round extends EventEmitter {
  constructor(
    public name: string,
    private weight: number /*This is to later calculate FIBA rankings since rounds have different weights in a formula */,
    private matches: Match[]
  ) {
    super();
  }
  addMatch(match: Match) {
    this.matches.push(match);
  }

  getWeight() {
    return this.weight;
  }
  getMatches() {
    return this.matches;
  }
  getRoundLength() {
    return this.matches.length;
  }
}
