import { GroupData } from "./group-data.interface";

export type DataLoader = (pathToFile: string) => GroupData;
