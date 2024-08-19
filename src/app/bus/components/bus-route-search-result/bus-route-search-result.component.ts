import { Component, input } from '@angular/core';
import { BusRouteSearchResult } from '../../models/bus-route-search-result';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'app-bus-route-search-result',
  standalone: true,
  templateUrl: './bus-route-search-result.component.html',
  styleUrl: './bus-route-search-result.component.scss',
  imports: [MatCard, MatCardContent],
})
export class BusRouteSearchResultComponent {
  item = input.required<BusRouteSearchResult>();
}
