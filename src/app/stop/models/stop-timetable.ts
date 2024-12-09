export type StopTimetable = {
  name: string;
  arrivals: { hour: string; minute: string }[];
}[];
