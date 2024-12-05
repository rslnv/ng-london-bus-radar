import { LineListItem } from './line-list-item';

export type StopListItem = {
  id: string;
  commonName: string;
  stopLetter?: string;
  towards?: string;
  lines: LineListItem[];
};
