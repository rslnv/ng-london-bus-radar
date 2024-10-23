export type StopTimetable = {
  weekday: StopTimetableItem[];
  saturday: StopTimetableItem[];
  sunday: StopTimetableItem[];
};

export type StopTimetableItem = {
  hour: string;
  minute: string;
};
