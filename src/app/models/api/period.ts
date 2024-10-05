import { ServiceFrequency } from './service-frequency';
import { TwentyFourHourClockTime } from './twenty-four-hour-clock-time';

export type Period = {
  type: string;
  fromTime: TwentyFourHourClockTime;
  toTime: TwentyFourHourClockTime;
  frequency: ServiceFrequency;
};
