import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RouteSearchResponse } from '../models/api/route-search-response';
import { RouteSequence } from '../models/api/route-sequence';

export class TflService {
  private baseUrl = 'https://api.tfl.gov.uk';
  private httpClient = inject(HttpClient);

  public FindBusRoutes(searchTerm: string): Observable<RouteSearchResponse> {
    var params = new HttpParams().set('modes', 'bus');

    return this.httpClient.get<RouteSearchResponse>(
      `${this.baseUrl}/Line/Search/${searchTerm}`,
      { params },
    );
  }

  public RouteSequence(routeId: string, direction: string): Observable<any> {
    var params = new HttpParams()
      .set('serviceTypes', 'Regular,Night')
      .set('excludeCrowding', true);

    return this.httpClient.get<RouteSequence>(
      `${this.baseUrl}/Line/${routeId}/Route/Sequence/${direction}`,
      { params },
    );
  }
}
