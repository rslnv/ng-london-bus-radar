export type BusRouteDetailsResult = {
  lineId: string;
  lineName: string;
  direction: string;
  isOutboundOnly: boolean;
  from: string;
  to: string;
  stops: BusRouteDetailsStop[];
};

export type BusRouteDetailsStop = {
  id: string;
  name: string;
  stopLetter: string;
  lines: BusRouteDetailsStopLines[];
};

export type BusRouteDetailsStopLines = {
  id: string;
  name: string;
};
