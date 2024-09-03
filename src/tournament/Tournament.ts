import { TeamRepository } from "../team/TeamRepository";
import { Group } from "../Group";
import { Round } from "../Round";
import { GroupStage } from "./stages/group.stage";
import { IStage } from "../../types";
import { EliminationStage, RoundWeight } from "./stages/elimination.stage";
import { ResultSimulator } from "../ResultSimulator";

export class Tournament {
  private groups: Map<string, Group> = new Map();
  private round: Round;
  private stage: IStage;

  constructor(
    private teamRepo: TeamRepository,
    public resultSimulator: ResultSimulator,
    stage: IStage = new GroupStage(this, teamRepo)
  ) {
    this.round = new Round("initial", RoundWeight.GROUP, [], teamRepo);
    this.stage = stage;
  }

  getDrawingHats() {
    if (this.stage instanceof EliminationStage) {
      return this.stage.getDrawingHats();
    }
    return [];
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
