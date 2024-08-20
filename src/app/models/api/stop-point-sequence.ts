import { MatchedStop } from './matched-stop';

export type StopPointSequence = {
  lineId: string;
  lineName: string;
  direction: string;
  branchId: number;
  nextBranchIds: number;
  prevBranchIds: number;
  stopPoint: MatchedStop[];
  serviceType: string;
};
