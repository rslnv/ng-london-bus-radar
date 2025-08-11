export type StopTimetable = {
  stopId: string;
  lineId: string;
  schedules: {
    name: string;
    arrivals: { hour: string; minute: string }[];
  }[];
};
