import { RouteSearchMatch } from './route-search-match';

export type RouteSearchResponse = {
  input: string;
  searchMatches: RouteSearchMatch[];
};
