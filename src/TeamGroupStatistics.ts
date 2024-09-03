import { Points } from "./Team";
import { IComparable } from "../types";
import { MatchResult } from "./MatchResult";

export class TeamGroupStatistics implements IComparable<TeamGroupStatistics> {
  matchesPlayed: number;
  wins: number;
  losses: number;
  pointsForwarded: number;
  pointsAccepted: number;
  points: number;

  constructor() {
    this.matchesPlayed = 0;
    this.wins = 0;
    this.losses = 0;
    this.pointsForwarded = 0;
    this.pointsAccepted = 0;
    this.points = 0;
  }

  addMatchesPlayed() {
    this.matchesPlayed += 1;
  }
  getMatchesPlayed() {
    return this.matchesPlayed;
  }
  addWin() {
    this.wins += 1;
  }
  getWins() {
    return this.wins;
  }
  addLoss() {
    this.losses += 1;
  }
  getLosses() {
    return this.losses;
  }
  addPointsForwarded(points: number) {
    this.pointsForwarded += points;
  }
  getPointsForwarded() {
    return this.pointsForwarded;
  }

  addPointsAccepted(points: number) {
    this.pointsAccepted += points;
  }
  getPointsAccepted() {
    return this.pointsAccepted;
  }

  getPointDifference() {
    return this.pointsForwarded - this.pointsAccepted;
  }

  addPoints(points: number) {
    this.points += points;
  }
  getPoints() {
    return this.points;
  }

  resolveMatch(teamName: string, result: MatchResult) {
    if (result.winner === null) {
      this.drawMatch(teamName, result);
    } else if (result.winner === teamName) {
      this.winMatch(teamName, result);
    } else {
      this.loseMatch(teamName, result);
    }
  }

  private winMatch(name: string, result: MatchResult) {
    const pointsForwarded = result.getTeamScore(name);
    const pointsAccepted = result.getOtherTeamScore(name);

    if (pointsForwarded < pointsAccepted)
      throw new Error("Points forwarded is less than points accepted");
    if (result.forfeit) {
      this.winByForfeit();
      return;
    }

    this.addMatchesPlayed();
    this.addWin();
    this.addPointsForwarded(pointsForwarded);
    this.addPointsAccepted(pointsAccepted);
    this.addPoints(Points.WIN_POINTS);
  }

  private loseMatch(name: string, result: MatchResult) {
    const pointsForwarded = result.getTeamScore(name);
    const pointsAccepted = result.getOtherTeamScore(name);

    if (pointsForwarded > pointsAccepted)
      throw new Error("Points forwarded is more than points accepted");
    if (result.forfeit) {
      this.loseByForfeit();
      return;
    }

    this.addMatchesPlayed();
    this.addLoss();
    this.addPointsForwarded(pointsForwarded);
    this.addPointsAccepted(pointsAccepted);
    this.addPoints(Points.LOSS_POINTS);
  }

  private drawMatch(name: string, result: MatchResult) {
    const pointsForwarded = result.getTeamScore(name);
    const pointsAccepted = pointsForwarded;

    if (pointsForwarded !== pointsAccepted)
      throw new Error("Points forwarded and points accepted aren't equal");
    this.addMatchesPlayed();
    this.addPointsForwarded(pointsForwarded);
    this.addPointsAccepted(pointsAccepted);
    this.addPoints(Points.DRAW_POINTS);
  }

  winByForfeit() {
    this.addMatchesPlayed();
    this.addWin();
    this.addPointsForwarded(20);
    this.addPointsAccepted(0); //
    this.addPoints(Points.WIN_POINTS);
  }

  loseByForfeit() {
    this.addMatchesPlayed();
    this.addLoss();
    this.addPointsForwarded(0);
    this.addPointsAccepted(20); //
    this.addPoints(Points.FORFEIT_POINTS);
  }

  compareTo(other: TeamGroupStatistics): number {
    const pointComparison = this.points - other.points;
    if (pointComparison !== 0) return pointComparison;

    const pointDifferenceComparison =
      this.getPointDifference() - other.getPointDifference();
    if (pointDifferenceComparison !== 0) return pointDifferenceComparison;

    return this.pointsForwarded - other.pointsForwarded;
  }
}
