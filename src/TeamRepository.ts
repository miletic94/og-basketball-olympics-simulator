import { Team } from "./Team";
import { DataLoader, TeamData } from "./strategies/data-loading.strategy";

export class TeamRepository {
  private static instance: TeamRepository;

  private teams: Map<string, Team> = new Map();

  private constructor(private dataLoader: DataLoader) {
    this.loadTeams();
  }

  static getInstance(dataLoader: DataLoader): TeamRepository {
    if (!TeamRepository.instance) {
      TeamRepository.instance = new TeamRepository(dataLoader);
    }
    return TeamRepository.instance;
  }

  private loadTeams() {
    const data = this.dataLoader("./groups.json");

    Object.keys(data).map((group) => {
      // TODO: Node.js weird behavior? When I put 'data.group.map' instead of data[group].map here, the pointer of where error starts is at the wrong place. Later on it gives the right line where error happened
      data[group].map((team: TeamData) => {
        this.teams.set(
          team.Team,
          new Team(team.Team, team.ISOCode, group, team.Points)
        );
      });
    });
  }

  getTeam(name: string): Team {
    const team = this.teams.get(name);
    if (team === undefined) throw Error(`Team with name ${name} doesn't exist`);
    return team;
  }

  // TODO: Delete if not needed
  // addTeam(team: Team) {
  //   this.teams.set(team.name, team);
  // }

  // getTeamsByNames(names: string[]) {
  //   return names.map((name) => this.getTeam(name));
  // }

  getAllTeams(): Team[] {
    return Array.from(this.teams.values());
  }
}
