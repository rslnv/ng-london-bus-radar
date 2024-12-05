import { Component, input } from '@angular/core';
import { StopArrival } from '../../models/stop-arrival';
import { TimeToStationPipe } from '../../../pipes/time-to-station.pipe';

@Component({
  selector: 'app-bus-arrival',
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
      .arrival {
        font-weight: bold;
        margin-left: auto;
        min-width: 60px;
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
        <div class="destination">{{ item().destinationName }}</div>
      </div>
      <div class="arrival">
        {{ item().timeToStation | timeToStation }}
      </div>
    </div>
  `,
  imports: [TimeToStationPipe],
})
export class BusArrivalComponent {
  item = input.required<StopArrival>();
}
