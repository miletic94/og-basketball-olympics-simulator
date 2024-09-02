import { TeamRepository } from "./TeamRepository";
import { Group } from "./Group";
import { Round } from "./Round";
import { GroupStage } from "./tournament-stages/group.stage";
import { IStage } from "../types";
import { RoundWeight } from "./tournament-stages/elimination.stage";

export class Tournament {
  private groups: Map<string, Group> = new Map();
  private round: Round;
  stage: IStage;

  constructor(
    private teamRepo: TeamRepository,
    stage: IStage = new GroupStage(this, teamRepo)
  ) {
    this.round = new Round("initial", RoundWeight.GROUP, []);
    this.stage = stage;
  }

  setStage(stage: IStage) {
    this.stage = stage;
  }

  // TODO: Does it need to be here?
  setGroups(groups: Map<string, Group>) {
    this.groups = groups;
  }

  getGroups() {
    return this.groups;
  }

  setRound(round: Round) {
    this.round = round;
  }

  getRound() {
    return this.round;
  }

  playRound() {
    this.stage.playRound();
  }

  createGroups() {
    this.stage.setGroups(this.teamRepo);
  }

  rankTeams() {
    this.stage.rankTeams();
  }

  setFirstRound() {
    this.stage.setFirstRound();
  }

  setNextRound() {
    this.stage.setNextRound();
  }
}
