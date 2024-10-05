import { Timetable } from "./timetable";

export type TimetableResponse = {
  lineId: string;
  lineName: string;
  direction: string;
  pdfUrl: string;
  stations: any[]; //Tfl-20[];
  stops: any[]; // Tfl-20[];
  timetable: Timetable;
  disambiguation: any[]; // Tfl-38;
  statusErrorMessage: string;
};
