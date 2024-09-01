import { ISortStrategy, ITeamRanker } from "../types";
import { TeamGroupComparer } from "./comparers/Comparers";
import {} from "./strategies/merge-sorting.strategy";
import { TeamRepository } from "./TeamRepository";

export class Group implements ITeamRanker {
  name: string;
  private teamNames: string[];

  constructor(name: string, teamNames: string[]) {
    this.name = name;
    this.teamNames = teamNames;
  }

  addTeam(teamName: string) {
    if (!this.teamNames.includes(teamName)) {
      this.teamNames.push(teamName);
    }
  }

  rankTeams(sortStrategy: ISortStrategy) {
    sortStrategy.sort(this.teamNames, new TeamGroupComparer());
  }

  getTeams() {
    return this.teamNames;
  }

  // TODO: For testing
  // displayTeams() {
  //   const table: any = {};
  //   for (let i = 0; i < this.teamNames.length; i++) {
  //     const team = this.teamRepo.getTeam(this.teamNames[i]);

  //     table[i + 1] = {
  //       name: team.name,
  //       ISOCode: team.ISOCode,
  //       gamesPlayed: team.groupStatistics.gamesPlayed,
  //       wins: team.groupStatistics.wins,
  //       losses: team.groupStatistics.losses,
  //       pointsForwarded: team.groupStatistics.pointsForwarded,
  //       pointsAccepted: team.groupStatistics.pointsAccepted,
  //       pointDifference: team.groupStatistics.getPointDifference(),
  //       points: team.groupStatistics.points,
  //     };
  //   }
  //   return table;
  // }
}
