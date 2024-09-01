import { Group } from "../Group";
import { MergeSortStrategy } from "../strategies/merge-sorting.strategy";
import { Team } from "../Team";
import { TeamRepository } from "../TeamRepository";
import { Tournament } from "../Tournament";
import { IStage } from "./group.stage";

export class EliminationStage implements IStage {
  constructor(private tournamentContext: Tournament) {}
  // TODO: Generalize
  createGroups(teamRepo: TeamRepository): void {
    // TODO: Groups should be sorted at this point (check the logic)
    const groups = this.tournamentContext.getGroups();
    const eliminationGroups = new Map(
      ["group1", "group2", "group3"].map((name, index) => {
        const group = new Group(name, []);
        groups.forEach((g) => {
          g.rankTeams(new MergeSortStrategy(teamRepo));
          group.addTeam(g.getTeams()[index]);
        });
        return [name, group];
      })
    );
    eliminationGroups;

    this.tournamentContext.setGroups(eliminationGroups);
  }

  createRounds(): void {}

  listFromGroups(groups: Map<string, Group>) {
    const teamList: string[] = [];

    groups.forEach((group) => {
      group.getTeams().forEach((team) => {
        teamList.push(team);
      });
    });
  }

  playRounds(): void {}
}
