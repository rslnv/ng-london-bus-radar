import { AdditionalProperties } from './additional-properties';

export type Place = {
  id: string;
  url: string;
  commonName: string;
  distance: number;
  placeType: string;
  additionalProperties: AdditionalProperties[];
  children: Place[];
  childrenUrls: string[];
  lat: number;
  lon: number;
};
