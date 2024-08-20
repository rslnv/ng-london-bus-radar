import { Component, input } from '@angular/core';
import { BusRouteDetailsStop } from '../../models/bus-route-details-result';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bus-route-stop',
  templateUrl: './bus-route-stop.component.html',
  styleUrl: './bus-route-stop.component.scss',
  standalone: true,
  imports: [MatIcon, CommonModule],
})
export class BusRoutStopComponent {
  stop = input.required<BusRouteDetailsStop>();
}
