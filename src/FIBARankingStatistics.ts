import { IComparable } from "../types";
import {
  BASIS_POINTS_TABLE,
  VictoryMargin,
} from "./constants/basisFIBAPointsTable.const";
import { MatchResult } from "./MatchResult";
import { Round } from "./Round";
import { TeamRepository } from "./TeamRepository";

export class FIBARankingStatistics
  implements IComparable<FIBARankingStatistics>
{
  private points: number;
  /**
   * Part of FIBA ranking system. Property `points` is result of averaging points in previous games.
   * When the team plays next game, we calculate points from that game, average it out with previous points and add 1 to this counter
   * SO this number is number of previous games that will have effect on FIBA points of the team
   */
  private previousGamesCount = 20;
  constructor(points: number = 0, private teamRepo: TeamRepository) {
    this.points = points;
  }

  getPoints() {
    return this.points;
  }

  resolveRound(teamName: string, round: Round) {
    const match = round.getMatches().find((match) => match.getTeam(teamName));
    if (!match) throw new Error(`Match for name ${teamName} not found`);

    const result = match.getResult();
    const opponentName = result.getOtherTeamName(teamName);
    const roundWeight = round.getWeight();

    if (result.winner === null) {
      this.drawMatch(opponentName, roundWeight);
    } else if (result.winner === teamName) {
      this.winMatch(teamName, opponentName, roundWeight, result);
    } else {
      this.loseMatch(teamName, opponentName, roundWeight, result);
    }

    this.incrementPreviousGamesCount();
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
  drawMatch(opponentName: string, roundWeight: number) {
    const basisPts = BASIS_POINTS_TABLE.winning[VictoryMargin.ZERO]; //  Draw case
    const opponentRanking = this.calculateOpponentsRanking(opponentName);
    const points =
      (this.previousGamesCount * this.points +
        roundWeight * (basisPts + opponentRanking)) /
      (this.previousGamesCount + 1);
    this.points = parseFloat(points.toFixed(1));
  }

  winMatch(
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
    const points =
      (this.previousGamesCount * this.points +
        roundWeight * (basisPts + opponentRanking)) /
      (this.previousGamesCount + 1);
    this.points = parseFloat(points.toFixed(1));
  }

  loseMatch(
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
    const points =
      (this.previousGamesCount * this.points +
        roundWeight * (basisPts + opponentRanking)) /
      (this.previousGamesCount + 1);

    this.points = parseFloat(points.toFixed(1));
  }

  private getVictoryMargin(teamScore: number, otherTeamScore: number) {
    const difference = teamScore - otherTeamScore;
    if (Math.abs(difference) === 0) return VictoryMargin.ZERO;
    if (Math.abs(difference) < 10) return VictoryMargin.LESS_THAN_TEN;
    if (Math.abs(difference) >= 10 && Math.abs(difference) <= 20)
      return VictoryMargin.TEN_TO_TWENTY;
    else return VictoryMargin.MORE_THAN_TWENTY; // if(Math.abs(difference) > 20)
  }

  winByForfeit(opponentName: string, roundWeight: number) {
    const basisPts = BASIS_POINTS_TABLE.winning[VictoryMargin.FORFEIT];
    const opponentRanking = this.calculateOpponentsRanking(opponentName);
    const points =
      (this.previousGamesCount * this.points +
        roundWeight * (basisPts + opponentRanking)) /
      (this.previousGamesCount + 1);
    this.points = parseFloat(points.toFixed(1));
  }

  loseByForfeit() {
    const forfeitPoints = 0;
    const points =
      (this.previousGamesCount * this.points + forfeitPoints) /
      (this.previousGamesCount + 1);
    this.points = parseFloat(points.toFixed(1));
  }

  compareTo(other: FIBARankingStatistics): number {
    return this.points - other.points;
  }
}
