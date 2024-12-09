import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeToStation',
})
export class TimeToStationPipe implements PipeTransform {
  transform(secondsToStation: number) {
    const minutes = Math.trunc(secondsToStation / 60);
    if (minutes === 0) return 'Due';
    else if (minutes === 1) return '1 min';
    else return `${minutes} mins`;
  }
}
