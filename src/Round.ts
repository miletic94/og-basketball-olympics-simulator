import EventEmitter from "events";
import { Match } from "./match/Match";
import { RoundWeight } from "./tournament/stages/elimination.stage";
import { TeamRepository } from "./team/TeamRepository";

export class Round extends EventEmitter {
  constructor(
    public name: string,
    private weight: RoundWeight /*This is to later calculate FIBA rankings since rounds have different weights in a formula */,
    private matches: Match[],
    private teamRepo: TeamRepository
  ) {
    super();
    this.setMaxListeners(12);
  }

  addMatch(match: Match) {
    this.matches.push(match);

    match.getTeams().forEach((team) => {
      const listeners = this.listeners("finish_round");
      if (!listeners.includes(this.teamRepo.getTeam(team).resolveRound)) {
        this.on("finish_round", this.teamRepo.getTeam(team).resolveRound);
      }
    });
  }

  finishRound() {
    this.emit("finish_round", this);
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
