import { IComparable } from "./comparers/Comparers";

export class FIBARankingStatistics
  implements IComparable<FIBARankingStatistics>
{
  private points: number;
  constructor(points: number = 0) {
    this.points = points;
  }

  getPoints() {
    return this.points;
  }
  setPoints(points: number) {
    this.points = points;
  }

  compareTo(other: FIBARankingStatistics): number {
    return this.points - other.points;
  }
}
