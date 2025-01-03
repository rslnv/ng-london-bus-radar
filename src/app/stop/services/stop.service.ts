import { inject, Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { StopPoint } from '../../models/api/stop-point';
import { TimetableRoute } from '../../models/api/timetable-route';
import { StopListItem } from '../../models/stop-list-item';
import { TflService } from '../../services/tfl.service';
import { StopArrival } from '../models/stop-arrival';
import { StopTimetable } from '../models/stop-timetable';

@Injectable({
  providedIn: 'root',
})
export class StopService {
  private tflService = inject(TflService);

  findByName(searchTerm: string): Observable<StopListItem[]> {
    return this.tflService.findStops(searchTerm).pipe(
      map((response) => {
        if (!response.matches.length) {
          throw new Error('Bus stop not found');
        }
        return response.matches.map((match) => match.id);
      }),
      switchMap((ids) => this.tflService.listStopPoints(ids)),
      map((stopPoints) =>
        stopPoints
          .map((sp) => sp.children)
          .flat()
          .filter(StopService.isBusStopPoint)
          .map(StopService.toStopListItem),
      ),
    );
  }

  findBySmsCode(searchTerm: string): Observable<StopListItem[]> {
    return this.tflService.findStops(searchTerm).pipe(
      map((response) => response.matches.map((match) => match.id)),
      switchMap((ids) =>
        this.tflService.listStopPoints(ids).pipe(
          map((stopPoints) =>
            stopPoints
              .map((sp) => sp.children)
              .flat()
              .sort((a, b) => StopService.stopIdMatchesSortFn(a, b, ids[0]))
              .map(StopService.toStopListItem),
          ),
        ),
      ),
    );
  }

  findByLocation(
    latitude: number,
    longitude: number,
    radius: number,
  ): Observable<StopListItem[]> {
    return this.tflService
      .findStopsNear(latitude, longitude, radius)
      .pipe(
        map((response) => response.stopPoints.map(StopService.toStopListItem)),
      );
  }

  private static stopIdMatchesSortFn = (
    a: StopPoint,
    b: StopPoint,
    stopId: string,
  ) => (a.id === stopId ? -1 : b.id === stopId ? 1 : 0);

  private static isBusStopPoint(stopPoint: StopPoint): boolean {
    const busLines =
      stopPoint.lineModeGroups.find((lmg) => lmg.modeName === 'bus')
        ?.lineIdentifier ?? [];
    return (
      stopPoint.lines.map((l) => l.id).filter((lid) => busLines.includes(lid))
        .length > 0
    );
  }

  private static toStopListItem = (stop: StopPoint): StopListItem => ({
    id: stop.id,
    commonName: stop.commonName,
    stopLetter: stop.stopLetter,
    lines: stop.lines.map((l) => ({ id: l.id, name: l.name })),
    towards: stop.additionalProperties.find((ap) => ap.key === 'Towards')
      ?.value,
    latitude: stop.lat,
    longitude: stop.lon,
  });

  details(stopId: string): Observable<StopListItem> {
    return this.tflService.stopPointDetails(stopId).pipe(
      map((details) => {
        const stopProperties = StopService.getStopProperties(details, stopId);
        const busLines =
          details.lineModeGroups.find((lmg) => lmg.modeName === 'bus')
            ?.lineIdentifier ?? [];

        return {
          id: stopId,
          stopLetter: stopProperties.stopLetter,
          towards: stopProperties.towards,
          commonName: details.commonName,
          lines: details.lines
            .map((l) => ({ id: l.id, name: l.name }))
            .filter((l) => busLines.includes(l.id)),
          latitude: details.lat,
          longitude: details.lon,
        };
      }),
    );
  }

  private static getStopProperties(stop: StopPoint, stopId: string) {
    const child = stop.children.find((s) => s.id === stopId);

    return {
      stopLetter: stop.stopLetter ?? child?.stopLetter,
      towards:
        stop.additionalProperties.find((ap) => ap.key === 'Towards')?.value ??
        child?.additionalProperties.find((ap) => ap.key === 'Towards')?.value,
    };
  }

  arrivals(stopId: string): Observable<StopArrival[]> {
    return this.tflService.stopPointArrivals(stopId).pipe(
      map((predictions) =>
        predictions
          .map((p) => ({
            id: p.tripId,
            lineId: p.lineId,
            lineName: p.lineName,
            destinationName: p.destinationName,
            timeToStation: p.timeToStation,
          }))
          .sort(StopService.arrivalSortFn),
      ),
    );
  }

  private static arrivalSortFn = (a: StopArrival, b: StopArrival) =>
    a.timeToStation - b.timeToStation;

  timetable(stopId: string, lineId: string): Observable<StopTimetable> {
    return this.tflService
      .stopPointTimetable(lineId, stopId)
      .pipe(
        map((response) =>
          StopService.toStopTimetable(response.timetable.routes[0]),
        ),
      );
  }

  private static toStopTimetable = (route: TimetableRoute): StopTimetable =>
    route.schedules.map((s) => ({
      name: s.name,
      arrivals: s.knownJourneys.map((kj) => ({
        hour: kj.hour,
        minute: kj.minute,
      })),
    }));
}
