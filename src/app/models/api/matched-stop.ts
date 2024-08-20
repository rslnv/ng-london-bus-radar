import { Identifier } from './identifier';

export type MatchedStop = {
  routeId: number;
  parentId: string;
  stationId: string;
  icsId: string;
  topMostParentId: string;
  direction: string;
  towards: string;
  modes: string[];
  stopType: string;
  stopLetter: string;
  zone: string;
  accessibilitySummary: string;
  hasDisruption: boolean;
  lines: Identifier[];
  status: boolean;
  id: string;
  url: string;
  name: string;
  lat: number;
  lon: number;
};
