import { readFileSync } from "fs";

interface GroupData {
  [groupName: string]: TeamData[];
}

export interface TeamData {
  Team: string; // team name
  ISOCode: string;
  FIBARanking: number; // Current place on a list
  Points: number; // FIBA Ranking points
}

export type DataLoader = (pathToFile: string) => GroupData;

export const dataLoader: DataLoader = (pathToFile: string) => {
  let data: GroupData;
  try {
    data = JSON.parse(readFileSync(pathToFile, "utf8"));
    return data;
  } catch (err) {
    console.error("Error reading the file:", err);
    return {};
  }
};
