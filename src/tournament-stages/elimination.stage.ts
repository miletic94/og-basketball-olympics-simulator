import { IStage } from "../../types";
import { Game } from "../Game";
import { Group } from "../Group";
import { Round } from "../Round";
import { MergeSortStrategy } from "../strategies/merge-sorting.strategy";
import { TeamRepository } from "../TeamRepository";
import { Tournament } from "../Tournament";
import { createPairsFromList } from "../utils/createPairsFromLIst.util";
import { randomBetween } from "../utils/randomBetween.util";
import { randomizePairs } from "../utils/randomizePairs.util";

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

  createRounds(teamRepo: TeamRepository): void {
    this.tournamentContext.clearRounds();
    const list = this.listFromGroups(this.tournamentContext.getGroups());
    const pairs = this.createPairsFromList(list);
    const randomizedPairs = this.randomizePairs(pairs, randomBetween);

    const randomizedPairs2 = this.randomizePairs(
      this.createPairsFromList(randomizedPairs),
      randomBetween
    ).flat();
    const roundName = "quarter finals";
    const round = new Round(
      "quarter finals",
      2,
      randomizedPairs.map((pair) => new Game(pair))
    );

    const cleanedRound = this.cleanRound(round, teamRepo);
    this.tournamentContext.getRounds().set(roundName, cleanedRound);
  }

  cleanRound(round: Round, teamRepo: TeamRepository) {
    const games = round.getGames();

    games.forEach((game, index) => {
      const teamNames = [game.homeTeam, game.awayTeam];
      const teams = teamRepo.getTeamsByNames(teamNames);

      if (teams[0].group === teams[1].group) {
        const temp = games[index + 1].awayTeam;
        games[index + 1].awayTeam = games[index].awayTeam;
        games[index].awayTeam = temp;
      }
      index++;
    });
    return round;
  }

  listFromGroups(groups: Map<string, Group>) {
    const teamList: string[] = [];

    groups.forEach((group) => {
      group.getTeams().forEach((team) => {
        teamList.push(team);
      });
    });
    return teamList;
  }

  createPairsFromList = createPairsFromList;

  randomizePairs = randomizePairs;

  playRounds(): void {}
}
