import { TimetableRoute } from "./timetable-route";

export type Timetable = {
  departureStopId: string;
  routes: TimetableRoute[];
};
