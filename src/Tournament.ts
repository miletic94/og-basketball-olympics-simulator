import { TeamRepository } from "./TeamRepository";
import { Group } from "./Group";
import { Round } from "./Round";
import { GroupStage, IStage } from "./tournament-stages/group.stage";

export class Tournament {
  private groups: Map<string, Group> = new Map();
  private rounds: Map<string, Round> = new Map();
  stage: IStage;

  constructor(
    private teamRepo: TeamRepository,
    stage: IStage = new GroupStage(this)
  ) {
    this.stage = stage;
  }

  setStage(stage: IStage) {
    this.stage = stage;
  }

  setGroups(groups: Map<string, Group>) {
    this.groups = groups;
  }

  getGroups() {
    return this.groups;
  }

  getRounds() {
    return this.rounds;
  }
  createGroups() {
    this.stage.createGroups(this.teamRepo);
  }

  createRounds() {
    this.stage.createRounds();
  }
}
