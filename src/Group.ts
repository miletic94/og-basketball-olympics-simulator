import { TeamGroupComparer } from "./comparers/Comparers";
import {
  ISortStrategy,
  ITeamRanker,
  MergeSortStrategy,
  SortFunction,
} from "./sorting-strategies/sorting-strategies";
import { TeamRepository } from "./TeamRepository";

export class Group implements ITeamRanker {
  name: string;
  teamNames: string[];

  constructor(
    name: string,
    teamNames: string[],
    private teamRepo: TeamRepository
  ) {
    this.name = name;
    this.teamNames = teamNames;
  }

  // TODO: For testing
  displayTeams() {
    const table: any = {};
    for (let i = 0; i < this.teamNames.length; i++) {
      const team = this.teamRepo.getTeam(this.teamNames[i]);

      table[i + 1] = {
        name: team.name,
        ISOCode: team.ISOCode,
        gamesPlayed: team.groupStatistics.gamesPlayed,
        wins: team.groupStatistics.wins,
        losses: team.groupStatistics.losses,
        pointsForwarded: team.groupStatistics.pointsForwarded,
        pointsAccepted: team.groupStatistics.pointsAccepted,
        pointDifference: team.groupStatistics.getPointDifference(),
        points: team.groupStatistics.points,
      };
    }
    return table;
  }

  rankTeams(sortStrategy: ISortStrategy) {
    sortStrategy.sort(this.teamNames, new TeamGroupComparer());
  }
}
