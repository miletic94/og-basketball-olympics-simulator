import { Pair } from "../types";
import { Group } from "./Group";
import { Tournament } from "./Tournament";
import { createPairsFromList } from "./utils/createPairsFromLIst.util";
import { randomBetween } from "./utils/randomBetween.util";
import { randomizePairs } from "./utils/randomizePairs.util";

export class DrawingHat {
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

  drawMatchPairs(groups: Map<string, Group>) {
    const list = this.listFromGroups(groups);
    console.log({ list });
    const hats = this.createPairsFromList(list);
    console.log({ hats });
    const matchPairs = this.randomizePairs(hats, randomBetween);
    console.log(matchPairs);

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
