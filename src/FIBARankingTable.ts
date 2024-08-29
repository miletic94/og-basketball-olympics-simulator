import { TeamFIBARankingComparer } from "./comparers/Comparers";
import {
  ISortStrategy,
  ITeamRanker,
  SortFunction,
} from "./sorting-strategies/sorting-strategies";
import { Team } from "./Team";
import { TeamRepository } from "./TeamRepository";

export class FibaRankingTable implements ITeamRanker {
  teamNames: string[];
  constructor(teamNames: string[], private teamRepo: TeamRepository) {
    this.teamNames = teamNames;
  }

  // TODO: For testing
  displayTable() {
    // const table = this.teamNames.map((name, index) => {
    //   const team = this.teamRepo.getTeam(name);
    //   return {
    //     rank: index + 1,
    //     name: team.name,
    //     ISOCode: team.ISOCode,
    //     points: team.fibaRankingStatistics.getPoints(),
    //   };
    // });
    const table: any = {};
    for (let i = 0; i < this.teamNames.length; i++) {
      const team = this.teamRepo.getTeam(this.teamNames[i]);

      table[i + 1] = {
        name: team.name,
        ISOCode: team.ISOCode,
        points: team.fibaRankingStatistics.getPoints(),
      };
    }
    console.table(table);
  }

  rankTeams(sortingStrategy: ISortStrategy): void {
    sortingStrategy.sort(this.teamNames, new TeamFIBARankingComparer());
  }
}
