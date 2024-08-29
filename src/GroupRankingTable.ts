import { Group } from "./Group";

export class GroupRankingTable {
  groups: Group[];
  constructor(groups: Group[]) {
    this.groups = groups;
  }

  // TODO: For testing
  displayTable() {
    const table: any = {};
    this.groups.map((group) => {
      const teams = group.displayTeams();
      table[group.name] = teams;
    });
    console.log(table);
  }
}
