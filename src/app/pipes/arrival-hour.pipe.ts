import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrivalHour',
})
export class TimeToStationPipe implements PipeTransform {
  transform(hourString: string) {
    let hour = +hourString;
    if (Number.isNaN(hour)) {
      return hourString;
    }
    hour = hour < 24 ? hour : hour % 24;
    const prefix = hour < 10 ? '0' : '';
    return `${prefix}${hour}`;
  }
}
