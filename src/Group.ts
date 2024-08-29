import { TeamGroupComparer } from "./comparers/Comparers";
import {
  sort,
  ITeamRanker,
  SortFunction,
} from "./sorting-strategies/sorting-strategies";
import { Team } from "./Team";

export class Group implements ITeamRanker {
  name: string;
  teams: Team[];

  constructor(name: string, teams: Team[]) {
    this.name = name;
    this.teams = teams;
  }

  rankTeams(sortFunction: SortFunction = sort) {
    sortFunction(this.teams, new TeamGroupComparer());
    console.log(this.teams);
  }
}
