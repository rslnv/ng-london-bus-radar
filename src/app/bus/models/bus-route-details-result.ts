import { StopListItem } from '../../models/stop-list-item';

export type BusRouteDetailsResult = {
  lineId: string;
  lineName: string;
  direction: string;
  isOutboundOnly: boolean;
  from: string;
  to: string;
  stops: StopListItem[];
  path: [number, number][];
};
