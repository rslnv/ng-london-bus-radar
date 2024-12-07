import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { combineLatest, switchMap } from 'rxjs';
import { BusStopComponent } from '../../../components/bus-stop/bus-stop.component';
import { BusRouteService } from '../../services/bus-route.service';

@Component({
  selector: 'app-bus-route-details',
  templateUrl: './route-details.component.html',
  styleUrl: './route-details.component.scss',
  imports: [BusStopComponent, CommonModule, MatIcon, RouterModule],
})
export class RouteDetailsComponent {
  busRouteService = inject(BusRouteService);

  routeId = input.required<string>();
  direction = input.required<string>();

  reverseDirection = computed(() =>
    this.direction() === 'outbound' ? 'inbound' : 'outbound',
  );

  data$ = combineLatest([
    toObservable(this.routeId),
    toObservable(this.direction),
  ]).pipe(
    switchMap(([routeId, direction]) =>
      this.busRouteService.details(routeId, direction),
    ),
  );
}
