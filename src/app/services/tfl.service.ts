import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RouteSearchResponse } from '../models/api/route-search-response';
import { RouteSequence } from '../models/api/route-sequence';
import { Prediction } from '../models/api/prediction';
import { StopPoint } from '../models/api/stop-point';
import { TimetableResponse } from '../models/api/timetable-response';
import { SearchResponse } from '../models/api/search-response';

@Injectable({
  providedIn: 'root',
})
export class TflService {
  private baseUrl = 'https://api.tfl.gov.uk';
  private httpClient = inject(HttpClient);

  public findBusRoutes(searchTerm: string): Observable<RouteSearchResponse> {
    var params = new HttpParams().set('modes', 'bus');

    return this.httpClient.get<RouteSearchResponse>(
      `${this.baseUrl}/Line/Search/${searchTerm}`,
      { params },
    );
  }

  public routeSequence(routeId: string, direction: string): Observable<any> {
    var params = new HttpParams()
      .set('serviceTypes', 'Regular,Night')
      .set('excludeCrowding', true);

    return this.httpClient.get<RouteSequence>(
      `${this.baseUrl}/Line/${routeId}/Route/Sequence/${direction}`,
      { params },
    );
  }

  public findStops(searchTerm: string): Observable<SearchResponse> {
    var params = new HttpParams().set('modes', 'bus');

    return this.httpClient.get<SearchResponse>(
      `${this.baseUrl}/StopPoint/Search/${searchTerm}`,
      { params },
    );
  }

  public listStopPoints(ids: string[]): Observable<StopPoint[]> {
    return this.httpClient
      .get<
        StopPoint | StopPoint[]
      >(`${this.baseUrl}/StopPoint/${ids.join(',')}`)
      .pipe(
        map((stopPoints) =>
          Array.isArray(stopPoints) ? stopPoints : [stopPoints],
        ),
      );
  }

  public stopPointDetails(stopId: string): Observable<StopPoint> {
    var params = new HttpParams().set('includeCrowdingData', false);

    return this.httpClient.get<StopPoint>(
      `${this.baseUrl}/StopPoint/${stopId}`,
      { params },
    );
  }

  public stopPointArrivals(stopId: string): Observable<Prediction[]> {
    return this.httpClient.get<Prediction[]>(
      `${this.baseUrl}/StopPoint/${stopId}/Arrivals`,
    );
  }

  public stopPointTimetable(
    routeId: string,
    stopId: string,
  ): Observable<TimetableResponse> {
    return this.httpClient.get<TimetableResponse>(
      `${this.baseUrl}/Line/${routeId}/Timetable/${stopId}`,
    );
  }
}
