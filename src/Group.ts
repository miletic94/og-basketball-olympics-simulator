import { TeamGroupComparer } from "./comparers/Comparers";
import { sort, RankingTable } from "./sorting-strategies/sorting-strategies";
import { Team } from "./Team";

export class Group implements RankingTable {
  name: string;
  teams: Team[];

  constructor(name: string, teams: Team[]) {
    this.name = name;
    this.teams = teams;
  }

  // TODO: Make better
  // TODO: To make this a real strategy, you could put it as a constructor parameter
  rankTeams() {
    const res = sort(this.teams, new TeamGroupComparer());
    console.log(res);
    return res;
  }
}
