import { inject, Injectable } from '@angular/core';
import { delay, map, Observable, tap } from 'rxjs';
import { StopPoint } from '../../models/api/stop-point';
import { TimetableResponse } from '../../models/api/timetable-response';
import { TflService } from '../../services/tfl.service';
import { StopArrival } from '../models/stop-arrival';
import { StopDetails } from '../models/stop-details';
import { StopTimetable, StopTimetableItem } from '../models/stop-timetable';

@Injectable({
  providedIn: 'root',
})
export class StopService {
  private tflService = inject(TflService);

  details(stopId: string): Observable<StopDetails> {
    return this.tflService.stopPointDetails(stopId).pipe(
      map((details) => {
        const stopProperties = this.getStopProperties(details, stopId);
        return {
          stopLetter: stopProperties.stopLetter,
          towards: stopProperties.towards,
          commonName: details.commonName,
          lines: details.lines.map((l) => ({ id: l.id, name: l.name })),
        };
      }),
    );
  }

  private getStopProperties(stop: StopPoint, stopId: string) {
    const child = stop.children.find((s) => s.id === stopId);

    return {
      stopLetter: stop.stopLetter ?? child?.stopLetter,
      towards: stop.additionalProperties.find((ap) => ap.key === 'Towards')
        ?.value,
      // child?.additionalProperties.find((ap) => ap.key === 'Towards')?.value,
    };
  }

  arrivals(stopId: string): Observable<StopArrival[]> {
    return this.tflService.stopPointArrivals(stopId).pipe(
      map((predictions) =>
        predictions.map((p) => ({
          id: p.tripId,
          lineId: p.lineId,
          lineName: p.lineName,
          destinationName: p.destinationName,
          timeToStation: p.timeToStation,
        })),
      ),
    );
  }

  timetable(stopId: string, lineId: string): Observable<StopTimetable> {
    return this.tflService.stopPointTimetable(lineId, stopId).pipe(
      // delay(2000),
      // tap(() => {
      //   if (Math.random() < 0.5) {
      //     throw new Error('Just throwing');
      //   }
      // }),
      map((response) => ({
        weekday: this.timetableForDay(response, 'Monday to Friday'),
        saturday: this.timetableForDay(response, 'Saturday'),
        sunday: this.timetableForDay(response, 'Sunday'),
      })),
    );
  }

  private timetableForDay(
    response: TimetableResponse,
    typeOfDay: 'Monday to Friday' | 'Saturday' | 'Sunday',
  ): StopTimetableItem[] {
    return (
      response.timetable.routes[0]?.schedules
        .find((s) => s.name === typeOfDay)
        ?.knownJourneys.map((kj) => ({ hour: kj.hour, minute: kj.minute })) ??
      []
    );
  }
}
