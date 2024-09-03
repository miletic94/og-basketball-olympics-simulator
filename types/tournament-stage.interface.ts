import type { TeamRepository } from "../src/team/TeamRepository";

export interface IStage {
  setGroups(teamRepo: TeamRepository): void;
  setFirstRound(): void;
  setNextRound(): void;
  playRound(): void;
  rankTeams(): void;
}
