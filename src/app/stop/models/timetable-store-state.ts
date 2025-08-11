import { StopTimetable } from './stop-timetable';
import { TimetableFilter } from './timetable-filter';

export type TimetableStoreState = {
  _data: StopTimetable[];
  status: 'done' | 'error' | 'loading';
  error: any;
  filter: TimetableFilter;
};
