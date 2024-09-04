import { DrawingHat } from "./tournament/DrawingHat";
import { Exhibition } from "./exhibition/Exhibition";
import { ResultSimulator } from "./ResultSimulator";
import { dataLoader } from "./strategies/dataLoading.strategy";
import { TeamRepository } from "./team/TeamRepository";
import { Tournament } from "./tournament/Tournament";
import { EliminationStage } from "./tournament/stages/elimination.stage";
import { GroupStage } from "./tournament/stages/group.stage";
import { SimulationLogger } from "./SimulationLogger";
import { ExhibitionLoader } from "./exhibition/ExhibitionDataLoader";

export class Simulator {
  private teamRepo: TeamRepository;
  private tournament: Tournament;
  private resultSimulator: ResultSimulator;
  private exhibition: Exhibition;
  private simulationLogger: SimulationLogger;
  constructor() {
    this.teamRepo = TeamRepository.getInstance(dataLoader);
    this.exhibition = new Exhibition(ExhibitionLoader, this.teamRepo);
    this.resultSimulator = new ResultSimulator(this.teamRepo);
    this.tournament = new Tournament(this.teamRepo, this.resultSimulator);
    this.simulationLogger = new SimulationLogger();
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

      this.simulationLogger.logGroupStageRound(round, this.teamRepo);

      this.tournament.getRound().finishRound();
    }
    this.tournament.rankTeams();

    this.simulationLogger.logFinalGroupRankings(
      this.tournament.getGroups(),
      this.teamRepo
    );
  }

  private playEliminationStage() {
    this.tournament.setStage(
      new EliminationStage(this.tournament, new DrawingHat(), this.teamRepo)
    );
    this.tournament.createGroups();
    this.tournament.setFirstRound();

    this.simulationLogger.logDrawingHats(this.tournament.getDrawingHats());

    this.simulationLogger.logEliminationStagePairs(
      this.tournament.getRound().getMatches()
    );

    const numOfMatches = this.tournament.getRound().getMatches().length;
    const numOfRounds = Math.log2(numOfMatches * 2);

    this.tournament.playRound();

    this.simulationLogger.loadEliminationStageRound(
      this.tournament.getRound().getMatches(),
      this.tournament.getRound().name
    );

    this.tournament.getRound().finishRound();

    for (let i = 0; i < numOfRounds - 1; i++) {
      this.tournament.setNextRound();
      this.tournament.playRound();

      this.simulationLogger.loadEliminationStageRound(
        this.tournament.getRound().getMatches(),
        this.tournament.getRound().name
      );

      this.tournament.getRound().finishRound();
    }
    this.tournament.rankTeams();

    this.simulationLogger.logMedals(this.tournament.getGroups());
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
