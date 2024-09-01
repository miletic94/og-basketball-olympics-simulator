import { GamePair, IStage } from "../../types";
import { Game } from "../Game";
import { Group } from "../Group";
import { Round } from "../Round";
import { TeamRepository } from "../TeamRepository";
import { Tournament } from "../Tournament";

export class GroupStage implements IStage {
  constructor(private tournamentContext: Tournament) {}

  createGroups(teamRepo: TeamRepository) {
    const groups = this.tournamentContext.getGroups();
    const teams = teamRepo.getAllTeams();
    teams.forEach((team) => {
      if (!groups.has(team.group)) {
        groups.set(team.group, new Group(team.group, []));
      }
      groups.get(team.group)!.addTeam(team.name);
    });
  }

  createRounds() {
    const roundGenerators: Generator<GamePair[], void, unknown>[] = [];
    let generatorsDone = false;

    for (const group of this.tournamentContext.getGroups().values()) {
      roundGenerators.push(this.roundRobinTournament(group.getTeams()));
    }

    let roundNumber = 1;

    while (!generatorsDone) {
      const roundName = `Round ${roundNumber}`;
      const round = new Round(roundName, 1, []);

      generatorsDone = true;

      for (const generator of roundGenerators) {
        const result = generator.next();

        if (!result.done) {
          result.value.forEach((game) => round.addGame(new Game(game)));
          generatorsDone = false;
        }
      }

      if (!generatorsDone)
        this.tournamentContext.getRounds().set(roundName, round);

      roundNumber++;
    }
  }

  playRounds(): void {}

  // helper functions roundRobinTournament and pivotFirstRotateRest
  private *roundRobinTournament(teams: string[]): Generator<GamePair[]> {
    if (teams.length % 2 !== 0) teams.push("dummy");

    const length = teams.length;
    const n = length - 1; // number of rounds

    let first, last; // pointers

    for (let i = 0; i < n; i++) {
      first = 0;
      last = length - 1;
      const round: GamePair[] = [];

      while (first < last) {
        if (teams[first] !== "dummy" && teams[last] !== "dummy") {
          round.push([teams[first], teams[last]]);
        }
        first++;
        last--;
      }

      yield round;

      teams = this.pivotFirstRotateRest(teams);
    }
  }

  /**
   *  Pivots the first element of an array and rotates the rest clockwise
   *  Example: array [1, 2, 3, 4]
   *  Rotation 1: [1, 4, 2, 3]
   *  Rotation 2: [1, 3, 4, 2]
   *  Rotation 3: [1, 2, 3, 4]
   * */
  pivotFirstRotateRest(array: any[]) {
    if (array.length == 0) return array;
    return [array[0], array[array.length - 1], ...array.slice(1, -1)];
  }
}
