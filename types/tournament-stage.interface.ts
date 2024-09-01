import type { TeamRepository } from "../src/TeamRepository";

export interface IStage {
  createGroups(teamRepo: TeamRepository): void;
  createRounds(teamRepo: TeamRepository): void;
  playRounds(): void;
}
