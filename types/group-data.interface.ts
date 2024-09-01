import { TeamData } from "./team-data.interface";

export interface GroupData {
  [groupName: string]: TeamData[];
}
