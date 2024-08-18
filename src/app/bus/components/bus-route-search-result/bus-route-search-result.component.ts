import { Component, input } from '@angular/core';
import { BusRouteSearchResult } from '../../models/bus-route-search-result';

@Component({
  selector: 'app-bus-route-search-result',
  template: ``,
})
export class BusRouteSearchResultComponent {
  item = input.required<BusRouteSearchResult>();
}
