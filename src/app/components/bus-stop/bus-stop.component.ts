import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { StopListItem } from '../../models/stop-list-item';

@Component({
  selector: 'app-bus-stop',
  standalone: true,
  styleUrl: './bus-stop.component.scss',
  templateUrl: './bus-stop.component.html',
  imports: [MatIcon, CommonModule],
})
export class BusStopComponent {
  stop = input.required<StopListItem>();
  hideLines = input<boolean>(false);
}
