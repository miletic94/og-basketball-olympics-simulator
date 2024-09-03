import { Team } from "./team/Team";
import { TeamRepository } from "./team/TeamRepository";

export class ResultSimulator {
  constructor(private teamRepo: TeamRepository) {}
  simulateMatchResult(teamAName: string, teamBName: string) {
    const teamA = this.teamRepo.getTeam(teamAName);
    const teamB = this.teamRepo.getTeam(teamBName);

    const winner = this.determineWinner(
      teamAName,
      teamBName,
      teamA.fibaRankingStatistics.getFibaPoints(),
      teamB.fibaRankingStatistics.getFibaPoints()
    );

    if (winner.forfeit) {
      return {
        [teamAName]: 0,
        [teamBName]: 0,
        forfeit: true,
      };
    }

    const scores = this.calculateScores(teamA, teamB, winner.winner);

    // TODO: Better type safety
    return {
      [teamAName]: scores[teamAName],
      [teamBName]: scores[teamBName],
      forfeit: false,
    };
  }

  private normalRandom(mean = 0, stddev = 1) {
    const u1 = Math.abs(Math.random());
    const u2 = Math.abs(Math.random());
    const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

    return z1 * stddev + mean;
  }

  private calculateScores(
    teamA: Team,
    teamB: Team,
    predeterminedWinner: string | null
  ) {
    let pointsA = this.normalRandom(
      teamA.fibaRankingStatistics.getMeanPoints(),
      teamA.fibaRankingStatistics.getStdDevPoints()
    );
    let pointsB = this.normalRandom(
      teamB.fibaRankingStatistics.getMeanPoints(),
      teamB.fibaRankingStatistics.getStdDevPoints()
    );

    // Ensure the predetermined winner wins
    if (predeterminedWinner === null) {
      // Gives the lesser points (hard game)
      if (pointsA > pointsB) {
        pointsA = pointsB; // Adjust score to ensure B wins
      }
      if (pointsB > pointsA) {
        pointsB = pointsA;
      }
    }

    if (predeterminedWinner === teamA.name && pointsA <= pointsB) {
      pointsA = pointsB + this.normalRandom(1, 1); // Adjust score to ensure A wins
    } else if (predeterminedWinner === teamB.name && pointsB <= pointsA) {
      pointsB = pointsA + this.normalRandom(1, 1); // Adjust score to ensure B wins
    }

    return {
      [teamA.name]: Math.round(pointsA),
      [teamB.name]: Math.round(pointsB),
    };
  }

  private determineWinner(
    teamAName: string,
    teamBName: string,
    fibaPointsA: number,
    fibaPointsB: number
  ): { winner: string | null; forfeit: boolean } {
    // Get the probabilities for the match outcomes
    const { probabilityA, probabilityB, probabilityDraw } =
      this.calculateWinProbability(fibaPointsA, fibaPointsB);

    // Generate a random number between 0 and 1
    const randomOutcome = Math.random();

    // Determine the match result based on the random number and cumulative probabilities
    if (randomOutcome < probabilityA) {
      return { winner: teamAName, forfeit: false };
    } else if (randomOutcome < probabilityA + probabilityB) {
      return { winner: teamBName, forfeit: false };
    } else if (randomOutcome < probabilityA + probabilityB + probabilityDraw) {
      return { winner: null, forfeit: false };
    }

    // else if (
    //     randomOutcome <=
    //     probabilityA +
    //       probabilityB +
    //       probabilityDraw +
    //       (probabilityForfeitA + probabilityForfeitB)
    //   )

    // Randomly choose which team forfeits
    return Math.random() < 0.5
      ? { winner: teamAName, forfeit: true }
      : { winner: teamBName, forfeit: true };
  }

  private calculateWinProbability(
    fibaPointsA: number,
    fibaPointsB: number,
    drawProbability = 0.05,
    forfeitProbability = 0.005,
    base = 10,
    eloFactor = 20 // TODO: This can be variable. The bigger it is, the mor uncertain result is
  ) {
    // Calculate initial win probabilities using the logistic function
    const initialWinProbabilityA =
      1 / (1 + Math.pow(base, (fibaPointsB - fibaPointsA) / eloFactor));
    const initialWinProbabilityB = 1 - initialWinProbabilityA;

    // Adjust win probabilities to account for draw and forfeit
    const adjustedWinProbabilityA =
      (initialWinProbabilityA - forfeitProbability / 2) *
      (1 - drawProbability - forfeitProbability);
    const adjustedWinProbabilityB =
      (initialWinProbabilityB - forfeitProbability / 2) *
      (1 - drawProbability - forfeitProbability);

    // The remaining probability is split between draw and forfeit
    const drawProb = drawProbability;
    const forfeitProbA = forfeitProbability / 2;
    const forfeitProbB = forfeitProbability / 2;

    return {
      probabilityA: adjustedWinProbabilityA,
      probabilityB: adjustedWinProbabilityB,
      probabilityDraw: drawProb,
      probabilityForfeitA: forfeitProbA,
      probabilityForfeitB: forfeitProbB,
    };
  }
}
