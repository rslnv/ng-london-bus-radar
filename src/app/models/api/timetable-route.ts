import { Schedule } from './schedule';
import { StationInterval } from './station-interval';

export type TimetableRoute = {
  stationIntervals: StationInterval[];
  schedules: Schedule[];
};
