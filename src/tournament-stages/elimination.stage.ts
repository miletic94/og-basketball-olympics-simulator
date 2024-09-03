import { IStage, Pair } from "../../types";
import { DrawingHat } from "../DrawingHat";
import { Match } from "../Match";
import { Group } from "../Group";
import { MergeSortStrategy } from "../strategies/MergeSorting.strategy";
import { TeamRepository } from "../TeamRepository";
import { Tournament } from "../Tournament";
import { randomBetween } from "../utils/randomBetween.util";
import { Round } from "../Round";

export class EliminationStage implements IStage {
  constructor(
    private tournamentContext: Tournament,
    private drawingHat: DrawingHat,
    private teamRepo: TeamRepository,
    private roundCounter = RoundName.length
  ) {}
  // TODO: Generalize
  setGroups(): void {
    const groups = this.tournamentContext.getGroups();
    groups.forEach((group) => {
      group.rankTeams(new MergeSortStrategy(this.teamRepo));
    });

    const eliminationGroups = new Map(
      ["group1", "group2", "group3"].map((name, index) => {
        const group = new Group(name, []);
        groups.forEach((g) => {
          g.rankTeams(new MergeSortStrategy(this.teamRepo));
          group.addTeam(g.getTeams()[index]);
        });
        return [name, group];
      })
    );
    eliminationGroups;

    this.tournamentContext.setGroups(eliminationGroups);
  }
  getDrawingHat() {
    return this.drawingHat;
  }
  setFirstRound(): void {
    const matchPairs = this.drawingHat.drawMatchPairs(
      this.tournamentContext.getGroups()
    );

    this.cleanMatchPairs(matchPairs);

    const randomizedBracketPairs =
      this.drawingHat.randomizeBracketPairs(matchPairs);

    const roundName = this.roundName();
    const round = new Round(
      roundName,
      this.roundWeight(roundName),
      randomizedBracketPairs.map((pair) => new Match(pair, this.teamRepo)),
      this.teamRepo
    );

    this.tournamentContext.setRound(round);
  }

  private roundWeight(roundName: RoundNameType) {
    const index = RoundNameIndex[roundName];
    return RoundWeightMap[roundName];
  }

  /**
   * BE CAREFUL: This method changes the class property. Use it only once per round name generation
   * @returns string
   */
  private roundName() {
    this.roundCounter--;
    return RoundName[this.roundCounter];
  }

  setNextRound(): void {
    const previousRound = this.tournamentContext.getRound();
    const previousMatches = previousRound.getMatches();
    const isPreviousSemiFinal = previousRound.getRoundLength() === 2;
    const roundName = this.roundName();
    const round = new Round(
      roundName,
      this.roundWeight(roundName),
      [],
      this.teamRepo
    );

    for (let i = 0; i < previousMatches.length; i = i + 2) {
      const [matchResult1, matchResult2] = [
        previousMatches[i].getResult(),
        previousMatches[i + 1].getResult(),
      ];
      const [winner1, winner2] = [matchResult1.winner, matchResult2.winner];

      if (winner1 === null || winner2 === null)
        throw new Error(
          `Each match of elimination rounds must have the winner.`
        );

      round.addMatch(new Match([winner1, winner2], this.teamRepo));

      // Meaning semi finals
      if (isPreviousSemiFinal) {
        const [loser1, loser2] = [
          matchResult1.getOtherTeamName(winner1),
          matchResult2.getOtherTeamName(winner2),
        ];

        round.addMatch(new Match([loser1, loser2], this.teamRepo));
      }
    }

    this.tournamentContext.setRound(round);
  }

  private cleanMatchPairs(matchPairs: Pair<string>[]) {
    matchPairs.forEach((pair, index) => {
      const teams = this.teamRepo.getTeamsByNames(pair);

      if (teams[0].group === teams[1].group) {
        const temp = matchPairs[index + 1][1];
        matchPairs[index + 1][1] = matchPairs[index][1];
        matchPairs[index][1] = temp;
      }
      index++;
    });
  }

  playRound(): void {
    const matches = this.tournamentContext.getRound().getMatches();

    matches.forEach((match) => {
      const teamNames = match.getTeams();
      const result = this.tournamentContext.resultSimulator.simulateMatchResult(
        teamNames[0],
        teamNames[1]
      );
      let teamScore1 = result[teamNames[0]] as number;
      let teamScore2 = result[teamNames[1]] as number;

      if (teamScore1 === teamScore2) {
        [teamScore1, teamScore2] = this.extraTime(teamScore1, teamScore2);
      }

      match.setResult(teamScore1, teamScore2);
    });
  }

  // In extra time, anyone can win
  extraTime(teamScore1: number, teamScore2: number): number[] {
    if (teamScore1 !== teamScore2) return [teamScore1, teamScore2];

    teamScore1 += randomBetween(5, 20);
    teamScore2 += randomBetween(5, 20);

    return this.extraTime(teamScore1, teamScore2);
  }

  // TODO: Make more pretty. Strategy of group sort?
  rankTeams(): void {
    const round = this.tournamentContext.getRound();
    const matches = round.getMatches();

    if (
      round.name !== RoundName[RoundNameIndex.FINALS] ||
      !matches.every((match) => {
        return match.getResult().winner !== null;
      })
    ) {
      throw new Error(
        "To rank matches at the final stage every match needs to be finished and round needs to be finals"
      );
    }

    const rank: string[] = [];

    for (let i = 0; i < matches.length; i++) {
      const result = matches[i].getResult();
      const winnerName = result.winner!; // we throw before if winner is null
      rank.push(winnerName);
      rank.push(result.getOtherTeamName(winnerName));
    }

    this.tournamentContext.setGroups(
      new Map([["final four", new Group("final four", rank)]])
    );
  }
}

// TODO: Move? Learn!
// RoundName to RoundWeight mapping

export enum RoundWeight {
  GROUP = 1,
  EIGHT_FINALS = 1,
  QUARTER_FINALS = 2,
  SEMI_FINALS = 4,
  FINALS = 6,
}

export const RoundName = [
  "FINALS", // Index 0
  "SEMI FINALS", // Index 1
  "QUARTER FINALS", // Index 2
] as const;

export type RoundNameType = (typeof RoundName)[number];

export const RoundNameIndex = RoundName.reduce((acc, name, index) => {
  acc[name] = index;
  return acc;
}, {} as Record<RoundNameType, number>);

export const RoundWeightMap: Record<RoundNameType, RoundWeight> = {
  FINALS: RoundWeight.FINALS,
  "SEMI FINALS": RoundWeight.SEMI_FINALS,
  "QUARTER FINALS": RoundWeight.QUARTER_FINALS,
};
