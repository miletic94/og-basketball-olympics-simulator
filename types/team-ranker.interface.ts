import type { ISortStrategy } from "./sort-strategy.interface";

export interface ITeamRanker {
  rankTeams(sort: ISortStrategy): void;
}
