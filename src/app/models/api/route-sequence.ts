import { MatchedStop } from './matched-stop';
import { OrderedRoute } from './ordered-route';
import { StopPointSequence } from './stop-point-sequence';

export type RouteSequence = {
  lineId: string;
  lineName: string;
  direction: string;
  isOutboundOnly: boolean;
  mode: string;
  lineStrings: string[];
  stations: MatchedStop[];
  stopPointSequences: StopPointSequence[];
  orderedLineRoutes: OrderedRoute[];
};
