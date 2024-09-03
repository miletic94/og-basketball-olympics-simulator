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

// const teamRepo = new TeamRepository(
//   new Map([
//     ["Serbia", new Team("Serbia", "SRB", 300)],
//     ["USA", new Team("USA", "USA", 300)],
//     ["South Sudan", new Team("South Sudan", "SSD", 100)],
//     ["Puerto Rico", new Team("Puerto Rico", "PUE", 200)],
//   ])
// );

// const group = new Group(
//   "C",
//   ["Serbia", "USA", "South Sudan", "Puerto Rico"],
//   teamRepo
// );

// const groupRankingTable = new GroupRankingTable([group]);

// const game = new Game("Serbia", "South Sudan");
// game.setResult(100, 80);
// game.registerTeamListeners([
//   teamRepo.getTeam("Serbia"),
//   teamRepo.getTeam("South Sudan"),
// ]);
// game.finishGame();

// const game2 = new Game("USA", "Puerto Rico");
// game2.setResult(100, 80);
// game2.registerTeamListeners([
//   teamRepo.getTeam("USA"),
//   teamRepo.getTeam("Puerto Rico"),
// ]);

// game2.finishGame();

// const fibaRankingTable = new FibaRankingTable(
//   ["Serbia", "South Sudan", "USA", "Puerto Rico"],
//   teamRepo
// );

// group.rankTeams(new MergeSortStrategy(teamRepo));
// groupRankingTable.displayTable();

// fibaRankingTable.rankTeams();
// fibaRankingTable.displayTable();

const teamRepo = TeamRepository.getInstance(dataLoader);

const tournament = new Tournament(teamRepo);
tournament.createGroups();
// console.log(tournament.getGroups());

// 1 Round
tournament.setFirstRound();
let round = tournament.getRound();
// console.log(round);

teamRepo.getAllTeams().forEach((team) => {
  console.log({
    teamName: team.name,
    FIBApts: team.fibaRankingStatistics.getPoints(),
  });
});
console.log(" ");

tournament.playRound();
round.finishRound();

teamRepo.getAllTeams().forEach((team) => {
  console.log({
    teamName: team.name,
    FIBApts: team.fibaRankingStatistics.getPoints(),
  });
});

// 2 Round
tournament.setNextRound();
round = tournament.getRound();
// console.log(round);

tournament.playRound();

// 3 Round
tournament.setNextRound();
round = tournament.getRound();

// console.log(round);

tournament.playRound();

tournament.rankTeams();

// ELIMINATION STAGE
tournament.setStage(
  new EliminationStage(tournament, new DrawingHat(), teamRepo)
);
tournament.createGroups();

// QUARTER FINALS
tournament.setFirstRound();
round = tournament.getRound();

// console.log(round);

tournament.playRound();

// SEMI FINALS
tournament.setNextRound();
round = tournament.getRound();

// console.log(round);

tournament.playRound();
// tournament.rankTeams(); // This should fail

// FINALS
tournament.setNextRound();
round = tournament.getRound();

// console.log(round);

tournament.playRound();

tournament.rankTeams();
console.log(tournament.getGroups());

// SLOŽI
// rankGroups only at the finish of a stage
// Control stage transition
