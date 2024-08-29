import { Team } from "../Team";

//TODO: Put types and interfaces in a typing system
export interface IComparer<T> {
  compare(a: T, b: T): number;
}

export interface IComparable<T> {
  compareTo(other: T): number;
}

// TODO: Put comparers in their own files
export class TeamGroupComparer implements IComparer<Team> {
  compare(a: Team, b: Team): number {
    return a.groupStatistics.compareTo(b.groupStatistics);
  }
}
