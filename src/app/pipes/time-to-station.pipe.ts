import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeToStation',
  standalone: true,
})
export class TimeToStationPipe implements PipeTransform {
  transform(secondsToStation: number) {
    const minutes = Math.trunc(secondsToStation / 60);
    if (minutes === 0) return 'Due';
    else if (minutes === 1) return '1 minute';
    else return `${minutes} minutes`;
  }
}
