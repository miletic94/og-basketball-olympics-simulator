import { IComparable } from "./comparers/Comparers";
import { Points } from "./Team";

export class TeamGroupStatistics implements IComparable<TeamGroupStatistics> {
  gamesPlayed: number;
  wins: number;
  losses: number;
  pointsForwarded: number;
  pointsAccepted: number;
  points: number;

  constructor() {
    this.gamesPlayed = 0;
    this.wins = 0;
    this.losses = 0;
    this.pointsForwarded = 0;
    this.pointsAccepted = 0;
    this.points = 0;
  }

  addGamePlayed() {
    this.gamesPlayed += 1;
  }
  getGamesPlayed() {
    return this.gamesPlayed;
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

  getTableData() {
    return {
      gamesPlayed: this.gamesPlayed,
      wins: this.wins,
      losses: this.losses,
      pointsForwarded: this.pointsForwarded,
      pointsAccepted: this.pointsAccepted,
      pointDifference: this.getPointDifference(),
      points: this.points,
    };
  }
  // TODO: This could be events that game emits
  winGame(pointsForwarded: number, pointsAccepted: number) {
    if (pointsForwarded < pointsAccepted)
      throw new Error("Points forwarded is less than points accepted");
    this.addGamePlayed();
    this.addWin();
    this.addPointsForwarded(pointsForwarded);
    this.addPointsAccepted(pointsAccepted);
    this.addPoints(Points.WIN_POINTS);
  }

  loseGame(pointsForwarded: number, pointsAccepted: number) {
    if (pointsForwarded > pointsAccepted)
      throw new Error("Points forwarded is more than points accepted");
    this.addGamePlayed();
    this.addLoss();
    this.addPointsForwarded(pointsForwarded);
    this.addPointsAccepted(pointsAccepted);
    this.addPoints(Points.LOSS_POINTS);
  }

  drawGame(pointsForwarded: number, pointsAccepted: number) {
    if (pointsForwarded != pointsAccepted)
      throw new Error("Points forwarded and points accepted aren't equal");
    this.addGamePlayed();
    this.addPointsForwarded(pointsForwarded);
    this.addPointsAccepted(pointsAccepted);
    this.addPoints(Points.DRAW_POINTS);
  }

  winByForfeit() {
    this.addGamePlayed();
    this.addWin();
    this.addPointsForwarded(20);
    this.addPointsAccepted(0); //
    this.addPoints(Points.WIN_POINTS);
  }

  forfeit() {
    this.addGamePlayed();
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
