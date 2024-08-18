import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RouteSearchResponse } from '../models/api/route-search-response';

export class TflService {
  private baseUrl = 'https://api.tfl.gov.uk';
  private httpClient = inject(HttpClient);

  public FindBusRoutes(searchTerm: string): Observable<RouteSearchResponse> {
    var params = new HttpParams().set('modes', 'bus');

    return this.httpClient.get<RouteSearchResponse>(
      `${this.baseUrl}/Line/Search/${searchTerm}`,
      { params: params },
    );
  }
}
