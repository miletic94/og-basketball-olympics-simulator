import { readFileSync } from "fs";
import type { DataLoader, GroupData } from "../../types";

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
