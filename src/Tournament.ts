import { TeamRepository } from "./TeamRepository";
import { Group } from "./Group";
import { Round } from "./Round";
import { Game, GamePair } from "./Game";
import { GroupStage, IStage } from "./tournament-stages/group.stage";

export class Tournament {
  private groups: Map<string, Group> = new Map();
  private rounds: Map<string, Round> = new Map();
  stage: IStage;

  constructor(private teamRepo: TeamRepository) {
    this.stage = new GroupStage(this);
    this.createGroups();
  }

  setStage(stage: IStage) {
    this.stage = stage;
  }

  getGroups() {
    return this.groups;
  }
  getRounds() {
    return this.rounds;
  }
  createGroups() {
    this.teamRepo.getAllTeams().forEach((team) => {
      if (!this.groups.has(team.group)) {
        this.groups.set(team.group, new Group(team.group, []));
      }
      this.groups.get(team.group)!.addTeam(team.name);
    });
  }

  createRounds() {
    this.stage.createRounds();
  }
}
