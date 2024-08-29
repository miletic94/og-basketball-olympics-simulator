import { TeamGroupStatistics } from "./TeamGroupStatistics";

export class Team {
  name: string;
  ISOCode: string;
  groupStatistics: TeamGroupStatistics;
  // TODO: This could be TeamStatistics

  constructor(name: string, ISOCode: string) {
    this.name = name;
    this.ISOCode = ISOCode;
    // TODO: This could be injected (DI)
    this.groupStatistics = new TeamGroupStatistics();
  }
}

// TODO: Move this?
export enum Points {
  WIN_POINTS = 2,
  LOSS_POINTS = 1,
  DRAW_POINTS = 1,
  FORFEIT_POINTS = 0,
}
