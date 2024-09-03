import { Pair } from "../../types";
import { Group } from "../Group";
import { Tournament } from "./Tournament";
import { createPairsFromList } from "../utils/createPairsFromLIst.util";
import { randomBetween } from "../utils/randomBetween.util";
import { randomizePairs } from "../utils/randomizePairs.util";

export class DrawingHat {
  private hats: Pair<string>[] = [];
  constructor() {}
  private listFromGroups(groups: Map<string, Group>) {
    const teamList: string[] = [];

    groups.forEach((group) => {
      group.getTeams().forEach((team) => {
        teamList.push(team);
      });
    });
    return teamList;
  }

  private createPairsFromList = createPairsFromList;

  private randomizePairs = randomizePairs;

  // TODO: Redesign
  private createDrawingHats(groups: Map<string, Group>) {
    const list = this.listFromGroups(groups);

    const hats = this.createPairsFromList(list);
    this.hats = hats;
  }

  getDrawingHats() {
    return this.hats;
  }

  drawMatchPairs(groups: Map<string, Group>) {
    this.createDrawingHats(groups);

    const matchPairs = this.randomizePairs(this.hats, randomBetween);

    return matchPairs;
  }

  randomizeBracketPairs(matchPairs: Pair<string>[]) {
    // TODO: Optimize?
    return this.randomizePairs(
      this.createPairsFromList(matchPairs),
      randomBetween
    ).flat();
  }
}
