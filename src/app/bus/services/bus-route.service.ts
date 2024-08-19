import { inject } from '@angular/core';
import { TflService } from '../../services/tfl.service';
import { map } from 'rxjs/operators';
import { RouteSearchResponse } from '../../models/api/route-search-response';
import { Observable } from 'rxjs';
import { BusRouteSearchResult } from '../models/bus-route-search-result';

export class BusRouteService {
  tflService = inject(TflService);

  public FindRoute(searchTerm: string): Observable<BusRouteSearchResult[]> {
    return this.tflService.FindBusRoutes(searchTerm).pipe(
      map(this.mapRouteSearchResponseToDto),
      map((x) => x.sort((a, b) => this.startsWithSortFn(a, b, searchTerm))),
    );
  }

  private startsWithSortFn = (
    a: BusRouteSearchResult,
    b: BusRouteSearchResult,
    searchTerm: string,
  ) =>
    (a.lineName.startsWith(searchTerm) && b.lineName.startsWith(searchTerm)) ||
    (!a.lineName.startsWith(searchTerm) && !b.lineName.startsWith(searchTerm))
      ? 0
      : a.lineName.startsWith(searchTerm)
        ? -1
        : 1;

  private mapRouteSearchResponseToDto(
    model: RouteSearchResponse,
  ): BusRouteSearchResult[] {
    let searchResults: BusRouteSearchResult[] = [];

    model.searchMatches.forEach((sm) => {
      const lineId = sm.lineId;
      const lineName = sm.lineName;

      sm.lineRouteSection.forEach((lrs) => {
        var item: BusRouteSearchResult = {
          id: `${lineId}-${lrs.direction}`,
          lineId,
          lineName,
          direction: lrs.direction,
          destination: lrs.vehicleDestinationText,
        };

        const ids = searchResults.map((x) => x.id);
        const isUnique = ids.indexOf(item.id) < 0;
        if (isUnique) {
          searchResults.push(item);
        }
      });
    });
    return searchResults;
  }
}
