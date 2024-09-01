import type { TeamRepository } from "../src/TeamRepository";

export interface IStage {
  createGroups(teamRepo: TeamRepository): void;
  createRounds(): void;
  playRounds(): void;
}
