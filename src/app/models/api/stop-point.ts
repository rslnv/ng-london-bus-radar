import { AdditionalProperties } from './additional-properties';
import { Identifier } from './identifier';
import { LineGroup } from './line-group';
import { LineModeGroup } from './line-mode-group';

export type StopPoint = {
  naptanId: string;
  platformName: string;
  indicator?: string;
  stopLetter?: string;
  modes: string[];
  icsCode: string;
  smsCode: string;
  stopType: string;
  stationNaptan: string;
  accessibilitySummary: string;
  hubNaptanCode: string;
  lines: Identifier[];
  lineGroup: LineGroup[];
  lineModeGroups: LineModeGroup[];
  fullName: string;
  naptanMode: string;
  status: boolean;
  id: string;
  url: string;
  commonName: string;
  distance: number;
  placeType: string;
  additionalProperties: AdditionalProperties[];
  children: StopPoint[];
  childrenUrls: string[];
  lat: number;
  lon: number;
};
