import { FibaRankingTable } from "./FIBARankingTable";
import { Game } from "./Game";
import { Group } from "./Group";
import { GroupRankingTable } from "./GroupRankingTable";
import { dataLoader } from "./strategies/data-loading.strategy";
import { MergeSortStrategy } from "./strategies/merge-sorting.strategy";
import { Team } from "./Team";
import { TeamRepository } from "./TeamRepository";
import { Tournament } from "./Tournament";
import { EliminationStage } from "./tournament-stages/elimination.stage";

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

// const teamRepo = TeamRepository.getInstance(dataLoader);
// console.time("test1");
// const tournament = new Tournament(teamRepo);
// tournament.createGroups();
// tournament.createGroups();
// console.log(tournament.getGroups());
// tournament.setStage(new EliminationStage(tournament));
// tournament.createGroups();
// tournament.createRounds();

// console.log(tournament.getGroups());
// console.log(tournament.getGroups());
// console.timeEnd("test1");
