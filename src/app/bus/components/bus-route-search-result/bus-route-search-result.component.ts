import { Component, input } from '@angular/core';
import { BusRouteSearchResult } from '../../models/bus-route-search-result';

@Component({
  selector: 'app-bus-route-search-result',
  standalone: true,
  styles: `
    .card {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 1em;

      .badge {
        min-width: 3em;
        height: 2em;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #c33;
        color: #fff;
        font-weight: bold;
        border-radius: 0.5em;
      }

      .destination {
        font-weight: bold;
        word-break: break-word;
      }
    }
  `,
  template: `
    <div class="card">
      <div class="badge">
        {{ item().lineName }}
      </div>
      <div class="content">
        <small>towards</small>
        <div class="destination">{{ item().destination }}</div>
      </div>
    </div>
  `,
})
export class BusRouteSearchResultComponent {
  item = input.required<BusRouteSearchResult>();
}
