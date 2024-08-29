import { Team } from "./Team";

export class TeamRepository {
  private teams: Map<string, Team>;

  constructor(teams: Map<string, Team>) {
    this.teams = teams;
  }

  addTeam(team: Team) {
    this.teams.set(team.name, team);
  }

  getTeam(name: string): Team {
    const team = this.teams.get(name);
    if (team === undefined) throw Error(`Team with name ${name} doesn't exist`);
    return team;
  }

  getTeamsByNames(names: string[]) {
    return names.map((name) => this.getTeam(name));
  }

  getAllTeams(): Team[] {
    return Array.from(this.teams.values());
  }
}
