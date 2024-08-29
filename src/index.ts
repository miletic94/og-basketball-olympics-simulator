import { FibaRankingTable } from "./FIBARankingTable";
import { Game } from "./Game";
import { Group } from "./Group";
import { GroupRankingTable } from "./GroupRankingTable";
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
game.on("finish", teamRepo.getTeam("Serbia").resolveGame);
game.on("finish", teamRepo.getTeam("South Sudan").resolveGame);
game.finishGame();

const game2 = new Game("USA", "Puerto Rico");
game2.setResult(100, 80);
game2.on("finish", teamRepo.getTeam("USA").resolveGame);
game2.on("finish", teamRepo.getTeam("Puerto Rico").resolveGame);
game2.finishGame();

const fibaRankingTable = new FibaRankingTable(
  ["Serbia", "South Sudan", "USA", "Puerto Rico"],
  teamRepo
);

group.rankTeams();
groupRankingTable.displayTable();

// fibaRankingTable.rankTeams();
// fibaRankingTable.displayTable();
