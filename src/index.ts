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
console.log(tournament.getGroups());
tournament.setStage(new EliminationStage(tournament));
tournament.createGroups();

tournament.createRounds();

console.log([...tournament.getRounds()][0][1]);

// 'Canada', 'Australia', 'Greece'
// 'Germany', 'France', 'Brasil'
//  'USA', 'Serbia'

// 1. 'Canada', 2. 'Germany',
// 3. 'USA'     4.'Australia',
// 5. 'France', 6. 'Serbia'
// 7. 'Greece', 8. 'Brasil'
// [1, 7], [3, 6], [2, 8], [4, 5]
