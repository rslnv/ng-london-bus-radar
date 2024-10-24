import { inject } from '@angular/core';
import { TflService } from '../../services/tfl.service';
import { map } from 'rxjs/operators';
import { RouteSearchResponse } from '../../models/api/route-search-response';
import { Observable } from 'rxjs';
import { BusRouteSearchResult } from '../models/bus-route-search-result';
import { RouteSequence } from '../../models/api/route-sequence';
import {
  BusRouteDetailsResult,
  BusRouteDetailsStop,
  BusRouteDetailsStopLines,
} from '../models/bus-route-details-result';
import { MatchedStop } from '../../models/api/matched-stop';

export class BusRouteService {
  private tflService = inject(TflService);

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

  FindRoute(searchTerm: string): Observable<BusRouteSearchResult[]> {
    return this.tflService.findBusRoutes(searchTerm).pipe(
      map(this.mapRouteSearchResponseToDto),
      map((x) => x.sort((a, b) => this.startsWithSortFn(a, b, searchTerm))),
    );
  }

  private mapRouteDetailsResponseToDto(
    model: RouteSequence,
  ): BusRouteDetailsResult {
    const stopPointsOrdered: MatchedStop[] = [];

    if (
      model.orderedLineRoutes.length !== 0 &&
      model.stopPointSequences.length !== 0
    ) {
      model.orderedLineRoutes[0].naptanIds.forEach((naptanId) => {
        const stop = model.stopPointSequences[0].stopPoint.find(
          (sp) => sp.id === naptanId,
        );
        if (stop) {
          stopPointsOrdered.push(stop);
        }
      });
    }

    const stops = stopPointsOrdered.map(
      (sp) =>
        ({
          id: sp.id,
          name: sp.name,
          stopLetter: sp.stopLetter,
          lines: sp.lines
            .filter((l) => l.id !== model.lineId)
            .map(
              (l) => ({ id: l.id, name: l.name }) as BusRouteDetailsStopLines,
            ),
        }) as BusRouteDetailsStop,
    );
    const from = !stops ? '' : stops[0].name;
    const to = !stops ? '' : stops[stops.length - 1].name;

    const detailsResult: BusRouteDetailsResult = {
      lineId: model.lineId,
      lineName: model.lineName,
      direction: model.direction,
      isOutboundOnly: model.isOutboundOnly,
      from,
      to,
      stops,
    };

    return detailsResult;
  }

  RouteDetails(routeId: string, direction: string) {
    return this.tflService
      .routeSequence(routeId, direction)
      .pipe(map(this.mapRouteDetailsResponseToDto));
  }
}
