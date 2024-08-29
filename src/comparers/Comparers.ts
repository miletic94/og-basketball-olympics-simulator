import { TeamGroupStatistics } from "../TeamGroupStatistics";

//TODO: Put types and interfaces in a typing system
export interface IComparer<T> {
  compare(a: T, b: T): number;
}

// TODO: Can this not be generic?
export interface IComparable<T> {
  compareTo(other: T): number;
}

// TODO: Put comparers in their own files
export class TeamGroupComparer implements IComparer<TeamGroupStatistics> {
  compare(a: TeamGroupStatistics, b: TeamGroupStatistics): number {
    return a.compareTo(b);
  }
}
