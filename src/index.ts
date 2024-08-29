import { FibaRankingTable } from "./FIBARankingTable";
import { Game } from "./Game";
import { Group } from "./Group";
import { GroupRankingTable } from "./GroupRankingTable";
import { MergeSortStrategy } from "./sorting-strategies/sorting-strategies";
import { Team } from "./Team";
import { TeamRepository } from "./TeamRepository";

const teamRepo = new TeamRepository(
  new Map([
    ["Serbia", new Team("Serbia", "SRB", 300)],
    ["USA", new Team("USA", "USA", 300)],
    ["South Sudan", new Team("South Sudan", "SSD", 100)],
    ["Puerto Rico", new Team("Puerto Rico", "PUE", 200)],
  ])
);

const group = new Group(
  "C",
  ["Serbia", "USA", "South Sudan", "Puerto Rico"],
  teamRepo
);

const groupRankingTable = new GroupRankingTable([group]);

const game = new Game("Serbia", "South Sudan");
game.setResult(100, 80);
game.registerTeamListeners([
  teamRepo.getTeam("Serbia"),
  teamRepo.getTeam("South Sudan"),
]);
game.finishGame();

const game2 = new Game("USA", "Puerto Rico");
game2.setResult(100, 80);
game2.registerTeamListeners([
  teamRepo.getTeam("USA"),
  teamRepo.getTeam("Puerto Rico"),
]);

game2.finishGame();

const fibaRankingTable = new FibaRankingTable(
  ["Serbia", "South Sudan", "USA", "Puerto Rico"],
  teamRepo
);

group.rankTeams(new MergeSortStrategy(teamRepo));
groupRankingTable.displayTable();

// fibaRankingTable.rankTeams();
// fibaRankingTable.displayTable();
