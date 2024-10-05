import { KnownJourney } from './known-journey';
import { Period } from './period';

export type Schedule = {
  name: string;
  knownJourneys: KnownJourney[];
  firstJourney: KnownJourney;
  lastJourney: KnownJourney;
  periods: Period[];
};
