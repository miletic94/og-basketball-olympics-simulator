import { DrawingHat } from "./DrawingHat";
import { Match } from "./Match";
import { Group } from "./Group";
import { dataLoader } from "./strategies/dataLoading.strategy";
import { MergeSortStrategy } from "./strategies/MergeSorting.strategy";
import { Team } from "./Team";
import { TeamRepository } from "./TeamRepository";
import { Tournament } from "./Tournament";
import { EliminationStage } from "./tournament-stages/elimination.stage";
import { createPairsFromList } from "./utils/createPairsFromLIst.util";
import { randomBetween } from "./utils/randomBetween.util";
import { randomizePairs } from "./utils/randomizePairs.util";
import { ExhibitionLoader } from "./ExhibitionDataLoader";
import { Exhibition } from "./Exhibition";

// const teamRepo = TeamRepository.getInstance(dataLoader);

// const tournament = new Tournament(teamRepo);
// tournament.createGroups();
// // console.log(tournament.getGroups());

// // 1 Round
// tournament.setFirstRound();
// let round = tournament.getRound();
// // console.log(round);

// tournament.playRound();
// round.finishRound();

// // 2 Round
// tournament.setNextRound();
// round = tournament.getRound();
// // console.log(round);

// tournament.playRound();

// // 3 Round
// tournament.setNextRound();
// round = tournament.getRound();

// // console.log(round);

// tournament.playRound();

// tournament.rankTeams();

// // ELIMINATION STAGE
// tournament.setStage(
//   new EliminationStage(tournament, new DrawingHat(), teamRepo)
// );
// tournament.createGroups();

// // QUARTER FINALS
// tournament.setFirstRound();
// round = tournament.getRound();

// // console.log(round);

// tournament.playRound();

// // SEMI FINALS
// tournament.setNextRound();
// round = tournament.getRound();

// // console.log(round);

// tournament.playRound();
// // tournament.rankTeams(); // This should fail

// // FINALS
// tournament.setNextRound();
// round = tournament.getRound();

// // console.log(round);

// tournament.playRound();

// tournament.rankTeams();
// console.log(tournament.getGroups());

// SLOŽI
// rankGroups only at the finish of a stage
// Control stage transition

const teamRepo = TeamRepository.getInstance(dataLoader);
const e = new Exhibition(ExhibitionLoader, teamRepo);
teamRepo.getAllTeams().forEach((team) => {
  console.log(team.fibaRankingStatistics);
});
e.setRound();
e.playRound();
teamRepo.getAllTeams().forEach((team) => {
  console.log(team.fibaRankingStatistics);
});
// console.log(e.getRound());
