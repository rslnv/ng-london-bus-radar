import { SearchMatch } from './search-match';

export type SearchResponse = {
  query: string;
  from: number;
  page: number;
  pageSize: number;
  provider: string;
  total: number;
  matches: SearchMatch[];
  maxScore: number;
};
