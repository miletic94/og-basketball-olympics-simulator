import { MatchPair, IStage } from "../../types";
import { Match } from "../Match";
import { Group } from "../Group";
import { Round } from "../Round";

import { MergeSortStrategy } from "../strategies/merge-sorting.strategy";
import { TeamRepository } from "../TeamRepository";
import { Tournament } from "../Tournament";
import { randomBetween } from "../utils/randomBetween.util";
import { RoundWeight } from "./elimination.stage";

export class GroupStage implements IStage {
  private roundGenerators: Generator<MatchPair[], void, unknown>[] = [];
  private roundGeneratorsDone = false;
  private roundCount = 0;

  constructor(
    private tournamentContext: Tournament,
    private teamRepo: TeamRepository
  ) {}

  setGroups() {
    const groups = this.tournamentContext.getGroups();
    const teams = this.teamRepo.getAllTeams();
    teams.forEach((team) => {
      if (!groups.has(team.group)) {
        groups.set(team.group, new Group(team.group, []));
      }
      groups.get(team.group)!.addTeam(team.name);
    });
  }

  setFirstRound() {
    for (const group of this.tournamentContext.getGroups().values()) {
      this.roundGenerators.push(this.roundRobinTournament(group.getTeams()));
    }

    this.setRound();
  }

  private roundName() {
    this.roundCount++;
    return `Round ${this.roundCount}`;
  }

  setNextRound(): void {
    this.setRound();
  }

  private setRound() {
    if (!this.roundGeneratorsDone) {
      const round = new Round(this.roundName(), RoundWeight.GROUP, []);

      this.roundGeneratorsDone = true;

      for (const generator of this.roundGenerators) {
        const result = generator.next();

        if (!result.done) {
          result.value.forEach((match) =>
            round.addMatch(new Match(match, this.teamRepo))
          );
          this.roundGeneratorsDone = false;
        }
      }

      if (!this.roundGeneratorsDone) this.tournamentContext.setRound(round);
      else {
        throw new Error(
          `There are no more rounds. Round generator called too many time`
        );
      }
    }
  }

  playRound(): void {
    const matches = this.tournamentContext.getRound().getMatches();

    matches.forEach((match) => {
      match.setResult(randomBetween(80, 120), randomBetween(80, 120));
      match.finishGroupMatch();
    });
  }

  rankTeams() {
    this.tournamentContext.getGroups().forEach((group) => {
      group.rankTeams(new MergeSortStrategy(this.teamRepo));
    });
  }

  // helper functions roundRobinTournament and pivotFirstRotateRest
  private *roundRobinTournament(teams: string[]): Generator<MatchPair[]> {
    if (teams.length % 2 !== 0) teams.push("dummy");

    const length = teams.length;
    const n = length - 1; // number of rounds

    let first, last; // pointers

    for (let i = 0; i < n; i++) {
      first = 0;
      last = length - 1;
      const round: MatchPair[] = [];

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
