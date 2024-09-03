import { IComparable } from "../../types";
import {
  BASIS_POINTS_TABLE,
  VictoryMargin,
} from "../constants/basisFIBAPointsTable.const";
import { MatchResult } from "../match/MatchResult";
import { Round } from "../Round";
import { TeamRepository } from "./TeamRepository";

export class FIBARankingStatistics
  implements IComparable<FIBARankingStatistics>
{
  /**
   * Part of FIBA ranking system. Property `points` is result of averaging points in previous games.
   * When the team plays next game, we calculate points from that game, average it out with previous points and add 1 to this counter
   * S0 this number is number of previous games that will have effect on FIBA points of the team
   * The higher the number is the slower will change of the variance and mean be.
   */
  private previousGamesCount = 5;
  constructor(
    private teamRepo: TeamRepository,
    private fibaPoints = 0,
    private meanPointsPerGame = 80, // TODO: These could be variables
    private stddevPointsPerGame = 1
  ) {}

  getFibaPoints() {
    return this.fibaPoints;
  }
  getMeanPoints() {
    return this.meanPointsPerGame;
  }
  getStdDevPoints() {
    return this.stddevPointsPerGame;
  }
  // TODO: Not good - not terrible
  resolveRound(teamName: string, round: Round) {
    const matches = round
      .getMatches()
      .map((match) => {
        if (match.getTeam(teamName)) return match;
      })
      .filter((match) => match !== undefined);

    matches.forEach((match) => {
      if (!match) throw new Error(`Match for name ${teamName} not found`);

      const result = match.getResult();
      const opponentName = result.getOtherTeamName(teamName);
      const roundWeight = round.getWeight();

      this.updateMeanAndStdDev(result.getTeamScore(teamName));

      if (result.winner === null) {
        this.drawMatch(opponentName, roundWeight);
      } else if (result.winner === teamName) {
        this.winMatch(teamName, opponentName, roundWeight, result);
      } else {
        this.loseMatch(teamName, opponentName, roundWeight, result);
      }

      this.incrementPreviousGamesCount();
    });
  }

  private updateMeanAndStdDev(newPoint: number) {
    // Update mean
    const mean = this.meanPointsPerGame;
    const n = this.previousGamesCount;
    const stddev = this.stddevPointsPerGame;

    const newMean = mean + (newPoint - mean) / (n + 1);

    // Update variance
    const variance = Math.pow(stddev, 2);
    const newVariance =
      ((n - 1) * variance) / n +
      ((newPoint - mean) * (newPoint - newMean)) / (n + 1);

    // Update standard deviation
    const newStdDev = Math.sqrt(newVariance);

    this.meanPointsPerGame = parseFloat(newMean.toPrecision(4));
    this.stddevPointsPerGame = parseFloat(newStdDev.toPrecision(4));
  }

  private incrementPreviousGamesCount() {
    this.previousGamesCount++;
  }

  private calculateOpponentsRanking(opponentName: string) {
    const averagePoints = this.teamRepo.getAverageFIBAPoints();
    const oppTeamPoints = this.teamRepo.getTeamFIBAPoints(opponentName);
    return 1.5 * (oppTeamPoints - averagePoints);
  }

  // TODO: Refactor
  private drawMatch(opponentName: string, roundWeight: number) {
    const basisPts = BASIS_POINTS_TABLE.winning[VictoryMargin.ZERO]; //  Draw case
    const opponentRanking = this.calculateOpponentsRanking(opponentName);
    const fibaPoints =
      (this.previousGamesCount * this.fibaPoints +
        roundWeight * (basisPts + opponentRanking)) /
      (this.previousGamesCount + 1);
    this.fibaPoints = parseFloat(fibaPoints.toFixed(1));
  }

  private winMatch(
    teamName: string,
    opponentName: string,
    roundWeight: number,
    result: MatchResult
  ) {
    const teamScore = result.getTeamScore(teamName);
    const opponentScore = result.getTeamScore(opponentName);

    if (result.forfeit) {
      this.winByForfeit(opponentName, roundWeight);
      return;
    }
    const victoryMargin = this.getVictoryMargin(teamScore, opponentScore);
    const basisPts = BASIS_POINTS_TABLE.winning[victoryMargin];
    const opponentRanking = this.calculateOpponentsRanking(opponentName);
    const fibaPoints =
      (this.previousGamesCount * this.fibaPoints +
        roundWeight * (basisPts + opponentRanking)) /
      (this.previousGamesCount + 1);
    this.fibaPoints = parseFloat(fibaPoints.toFixed(1));
  }

  private loseMatch(
    teamName: string,
    opponentName: string,
    roundWeight: number,
    result: MatchResult
  ) {
    const teamScore = result.getTeamScore(teamName);
    const opponentScore = result.getTeamScore(opponentName);

    if (result.forfeit) {
      this.loseByForfeit();
      return;
    }
    const victoryMargin = this.getVictoryMargin(teamScore, opponentScore);
    const basisPts = BASIS_POINTS_TABLE.losing[victoryMargin];
    const opponentRanking = this.calculateOpponentsRanking(opponentName);
    const fibaPoints =
      (this.previousGamesCount * this.fibaPoints +
        roundWeight * (basisPts + opponentRanking)) /
      (this.previousGamesCount + 1);

    this.fibaPoints = parseFloat(fibaPoints.toFixed(1));
  }

  private getVictoryMargin(teamScore: number, otherTeamScore: number) {
    const difference = teamScore - otherTeamScore;
    if (Math.abs(difference) === 0) return VictoryMargin.ZERO;
    if (Math.abs(difference) < 10) return VictoryMargin.LESS_THAN_TEN;
    if (Math.abs(difference) >= 10 && Math.abs(difference) <= 20)
      return VictoryMargin.TEN_TO_TWENTY;
    else return VictoryMargin.MORE_THAN_TWENTY; // if(Math.abs(difference) > 20)
  }

  private winByForfeit(opponentName: string, roundWeight: number) {
    const basisPts = BASIS_POINTS_TABLE.winning[VictoryMargin.FORFEIT];
    const opponentRanking = this.calculateOpponentsRanking(opponentName);
    const fibaPoints =
      (this.previousGamesCount * this.fibaPoints +
        roundWeight * (basisPts + opponentRanking)) /
      (this.previousGamesCount + 1);
    this.fibaPoints = parseFloat(fibaPoints.toFixed(1));
  }

  private loseByForfeit() {
    const forfeitPoints = 0;
    const fibaPoints =
      (this.previousGamesCount * this.fibaPoints + forfeitPoints) /
      (this.previousGamesCount + 1);
    this.fibaPoints = parseFloat(fibaPoints.toFixed(1));
  }

  compareTo(other: FIBARankingStatistics): number {
    return this.fibaPoints - other.fibaPoints;
  }
}
