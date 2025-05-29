
import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { StopListItem } from '../../models/stop-list-item';

@Component({
  selector: 'app-bus-stop',
  styleUrl: './bus-stop.component.scss',
  templateUrl: './bus-stop.component.html',
  imports: [MatIcon],
})
export class BusStopComponent {
  stop = input.required<StopListItem>();
  hideLines = input<boolean>(false);
}
