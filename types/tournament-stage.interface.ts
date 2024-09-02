import type { TeamRepository } from "../src/TeamRepository";

export interface IStage {
  setGroups(teamRepo: TeamRepository): void;
  setFirstRound(): void;
  setNextRound(): void;
  playRound(): void;
  rankTeams(): void;
}
