import { StopPoint } from './stop-point';

export type StopPointsResponse = {
  centrePoint: number[];
  stopPoints: StopPoint[];
  pageSize: number;
  total: number;
  page: number;
};
