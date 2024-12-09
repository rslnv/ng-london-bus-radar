import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  map,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { BusStopComponent } from '../../../components/bus-stop/bus-stop.component';
import { ErrorComponent } from '../../../components/error/error.component';
import { LoadingComponent } from '../../../components/loading/loading.component';
import {
  ViewStateDone,
  ViewStateError,
  ViewStateLoading,
} from '../../../models/view-state';
import { BusRouteDetailsResult } from '../../models/bus-route-details-result';
import { BusRouteService } from '../../services/bus-route.service';

@Component({
  selector: 'app-bus-route-details',
  templateUrl: './route-details.component.html',
  styleUrl: './route-details.component.scss',
  imports: [
    BusStopComponent,
    CommonModule,
    MatIcon,
    RouterModule,
    LoadingComponent,
    ErrorComponent,
  ],
})
export class RouteDetailsComponent {
  busRouteService = inject(BusRouteService);

  routeId = input.required<string>();
  routeId$ = toObservable(this.routeId);

  direction = input.required<string>();
  direction$ = toObservable(this.direction);

  reverseDirection = computed(() =>
    this.direction() === 'outbound' ? 'inbound' : 'outbound',
  );

  refresherSubject = new BehaviorSubject<void>(undefined);
  refresher$ = this.refresherSubject
    .asObservable()
    .pipe(tap((_) => console.log('refreshing')));

  viewModel$ = this.refresher$.pipe(
    switchMap((_) => combineLatest([this.routeId$, this.direction$])),
    tap((x) => console.log('Latest values', x)),
    switchMap(([routeId, direction]) =>
      this.busRouteService.details(routeId, direction).pipe(
        map((data) => ({ state: 'done', data }) as VM),
        catchError((err) => {
          console.error('Unable to find route details', err);
          return of({ state: 'error', error: err } as VM);
        }),
        startWith({ state: 'loading' } as VM),
      ),
    ),
  );
}

type VM =
  | ViewStateDone<BusRouteDetailsResult>
  | ViewStateLoading
  | ViewStateError;
