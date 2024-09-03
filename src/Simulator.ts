import { DrawingHat } from "./DrawingHat";
import { Exhibition } from "./Exhibition";
import { ExhibitionLoader } from "./ExhibitionDataLoader";
import { ResultSimulator } from "./ResultSimulator";
import { dataLoader } from "./strategies/dataLoading.strategy";
import { TeamRepository } from "./TeamRepository";
import { Tournament } from "./Tournament";
import { EliminationStage } from "./tournament-stages/elimination.stage";
import { GroupStage } from "./tournament-stages/group.stage";

export class Simulator {
  private teamRepo: TeamRepository;
  private tournament: Tournament;
  private resultSimulator: ResultSimulator;
  private exhibition: Exhibition;
  constructor() {
    this.teamRepo = TeamRepository.getInstance(dataLoader);
    this.exhibition = new Exhibition(ExhibitionLoader, this.teamRepo);
    this.resultSimulator = new ResultSimulator(this.teamRepo);
    this.tournament = new Tournament(this.teamRepo, this.resultSimulator);
  }
  simulate() {
    this.playExhibition();
    this.playGroupStage();
    this.playEliminationStage();
  }

  private playExhibition() {
    this.exhibition.setRound();
    this.exhibition.playRound();
  }

  private playGroupStage() {
    this.tournament.setStage(new GroupStage(this.tournament, this.teamRepo));
    this.tournament.createGroups();
    const groupsArray = [...this.tournament.getGroups().values()];
    const teamsPerGroup = groupsArray[0].getTeams().length;
    const numberOfRounds = this.factorial(teamsPerGroup - 1) / 2;

    for (let i = 0; i < numberOfRounds; i++) {
      if (i === 0) this.tournament.setFirstRound();
      else this.tournament.setNextRound();

      this.tournament.playRound();
      const round = this.tournament.getRound();

      console.log(`${round.name}`);
      let groupName = "";
      round.getMatches().forEach((match) => {
        const teamNames = match.getTeams();
        const teams = this.teamRepo.getTeamsByNames(teamNames);
        const group = teams[0].group;
        if (group !== groupName) {
          console.log(`     Group ${group}`);
          groupName = group;
        }
        const score = match.getResult().getScore();

        const string = `        ${[...score.keys()].join(" - ")}  (${[
          ...score.values(),
        ].join(":")})`;

        console.log(string);
      });

      this.tournament.getRound().finishRound();
    }
    this.tournament.rankTeams();

    console.log(`\nFinal group rankings:`);
    this.tournament.getGroups().forEach((group) => {
      const teamNames = group.getTeams();
      const teams = this.teamRepo.getTeamsByNames(teamNames);

      console.log(`\nGroup ${group.name}:`);
      console.log(`rank name\twins\tlosses\tpoints\tPF\tPA\tPD`);
      teams.forEach((team, index) => {
        let teamName;
        team.name === "USA"
          ? (teamName = `${team.name}\t`)
          : (teamName = team.name);
        console.log(
          `${index + 1}. ${teamName}\t${team.groupStatistics.wins}\t${
            team.groupStatistics.losses
          }\t${team.groupStatistics.points}\t${
            team.groupStatistics.pointsForwarded
          }\t${
            team.groupStatistics.pointsAccepted
          }\t${team.groupStatistics.getPointDifference()}`
        );
      });
    });
  }

  private playEliminationStage() {
    this.tournament.setStage(
      new EliminationStage(this.tournament, new DrawingHat(), this.teamRepo)
    );
    this.tournament.createGroups();
    this.tournament.setFirstRound();
    console.log();
    const numOfMatches = this.tournament.getRound().getMatches().length;
    const numOfRounds = Math.log2(numOfMatches * 2);

    this.tournament.playRound();

    console.log(`${this.tournament.getRound().name}`);
    this.tournament
      .getRound()
      .getMatches()
      .forEach((match, index) => {
        const score = match.getResult().getScore();

        let string = `        ${[...score.keys()].join(" - ")}  (${[
          ...score.values(),
        ].join(":")})`;

        string = index % 2 === 1 ? string + `\n` : string;

        console.log(string);
      });

    this.tournament.getRound().finishRound();

    for (let i = 0; i < numOfRounds - 1; i++) {
      this.tournament.setNextRound();
      this.tournament.playRound();

      console.log(`${this.tournament.getRound().name}`);
      this.tournament
        .getRound()
        .getMatches()
        .forEach((match, index) => {
          const score = match.getResult().getScore();

          let string = `        ${[...score.keys()].join(" - ")}  (${[
            ...score.values(),
          ].join(":")})`;

          string = index % 2 === 1 ? string + `\n` : string;

          console.log(string);
        });

      this.tournament.getRound().finishRound();
    }
    this.tournament.rankTeams();

    console.log("Medals:");
    this.tournament.getGroups().forEach((group) => {
      const teams = group.getTeams();
      for (let i = 0; i < teams.length - 1; i++) {
        console.log(`\t${i + 1}. ${teams[i]}`);
      }
    });
  }

  // TODO: Should be util
  private factorial(n: number): number {
    if (n === 0 || n === 1) {
      return 1;
    } else {
      return n * this.factorial(n - 1);
    }
  }
}
