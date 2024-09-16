import { CommonModule, JsonPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { combineLatest, switchMap } from 'rxjs';
import { BusRoutStopComponent } from '../../components/bus-route-stop/bus-route-stop.component';
import { BusRouteService } from '../../services/bus-route.service';

@Component({
  selector: 'app-bus-route-details',
  templateUrl: './route-details.component.html',
  styleUrl: './route-details.component.scss',
  imports: [
    JsonPipe,
    CommonModule,
    MatIcon,
    MatSuffix,
    RouterModule,
    BusRoutStopComponent,
  ],
  providers: [BusRouteService],
  standalone: true,
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
      this.busRouteService.RouteDetails(routeId, direction),
    ),
  );
}
