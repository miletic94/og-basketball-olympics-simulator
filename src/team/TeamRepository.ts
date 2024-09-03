import { DataLoader, TeamData } from "../../types";
import { TEAM_DATA_PATH } from "../constants/teamDataPath.const";
import { Team } from "./Team";

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

  //TODO:  Maybe put this into different class (together with dataLoader function) to make that class responsible for loading the data and this one only for being repository
  private loadTeams() {
    const data = this.dataLoader(TEAM_DATA_PATH);

    Object.keys(data).map((group) => {
      // TODO: Node.js weird behavior? When I put 'data.group.map' instead of data[group].map here, the pointer of where error starts is at the wrong place. Later on it gives the right line where error happened
      data[group].map((team: TeamData) => {
        this.teams.set(
          team.Team,
          new Team(team.Team, team.ISOCode, group, team.Points, this)
        );
      });
    });
  }

  getTeam(name: string): Team {
    const team = this.teams.get(name);
    if (team === undefined) throw Error(`Team with name ${name} doesn't exist`);
    return team;
  }

  getTeamNameByISO(ISO: keyof typeof ISOtoNameMap) {
    const team = this.teams.get(ISOtoNameMap[ISO]);
    if (team === undefined)
      throw Error(`Team with ISO name ${ISO} doesn't exist`);
    return team.name;
  }

  getTeamsByNames(teamNames: string[]) {
    return teamNames.map((name) => {
      const team = this.teams.get(name);
      if (!team) throw new Error(`No team with name ${name}`);
      return team;
    });
  }

  getAverageFIBAPoints() {
    const teams = this.getAllTeams();
    const sum = teams.reduce((acc, curr) => {
      return acc + curr.fibaRankingStatistics.getFibaPoints();
    }, 0);
    return sum / teams.length;
  }

  getTeamFIBAPoints(teamName: string) {
    return this.getTeam(teamName).fibaRankingStatistics.getFibaPoints();
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

export const ISOtoNameMap = {
  GER: "Germany",
  FRA: "France",
  JPN: "Japan",
  SRB: "Serbia",
  CAN: "Canada",
  USA: "USA",
  SSD: "South Sudan",
  PRI: "Puerto Rico",
  AUS: "Australia",
  GRE: "Greece",
  BRA: "Brasil",
  ESP: "Spain",
};
