import { CommonModule } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import {
  BehaviorSubject,
  catchError,
  map,
  of,
  scan,
  shareReplay,
  startWith,
  switchMap,
  tap,
  timer,
} from 'rxjs';
import { BusStopComponent } from '../../../components/bus-stop/bus-stop.component';
import { ErrorComponent } from '../../../components/error/error.component';
import { LoadingComponent } from '../../../components/loading/loading.component';
import {
  ViewStateDone,
  ViewStateError,
  ViewStateLoading,
} from '../../../models/view-state';
import { BusArrivalComponent } from '../../components/bus-arrival/bus-arrival.component';
import { LineFilterComponent } from '../../components/line-filter/line-filter.components';
import { RefreshWithProgressComponent } from '../../components/refresh-with-progress/refresh-with-progress.component';
import { StopArrival } from '../../models/stop-arrival';
import { StopService } from '../../services/stop.service';
import { FavouritesToggleComponent } from '../favourites-toggle/favourites-toggle.component';
import { TimetableComponent } from '../timetable/timetable.component';
import { StopListItem } from '../../../models/stop-list-item';

@Component({
  selector: 'app-stop-arrivals',
  templateUrl: './arrivals.component.html',
  styleUrl: './arrivals.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    LineFilterComponent,
    TimetableComponent,
    MatButtonToggleModule,
    MatButtonModule,
    MatIconModule,
    BusStopComponent,
    BusArrivalComponent,
    LoadingComponent,
    ErrorComponent,
    RefreshWithProgressComponent,
    FavouritesToggleComponent,
  ],
})
export class StopArrivalsComponent {
  readonly REFRESH_PERIOD = 30;

  private stopService = inject(StopService);

  lineId = input.required<string>();

  stopId = input.required<string>();
  stopId$ = toObservable(this.stopId);

  refresherSubject = new BehaviorSubject<void>(undefined);
  refresher$ = this.refresherSubject.pipe(
    switchMap((_) => timer(0, this.REFRESH_PERIOD * 1000)),
    // alternating to trigger input signal
    scan((acc, _) => (acc + 1) % 2, 0),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  detailsRefresherSubject = new BehaviorSubject<void>(undefined);
  detailsRefresher$ = this.detailsRefresherSubject.asObservable();

  lineFilter = signal<string | null>(null);
  private lineFilter$ = toObservable(this.lineFilter);

  arrivalTimeSpan = signal<'live' | 'timetable'>('live');

  details$ = this.stopId$.pipe(
    switchMap((s) =>
      this.detailsRefresher$.pipe(
        switchMap((_) =>
          this.stopService.details(s).pipe(
            map((data) => ({ state: 'done', data }) as DetailsVM),
            catchError((err) => {
              console.error('Unable to find stop details', err);
              return of({ state: 'error', error: err } as DetailsVM);
            }),
            startWith({ state: 'loading' } as DetailsVM),
          ),
        ),
      ),
    ),
  );

  arrivals$ = this.stopId$.pipe(
    switchMap((s) =>
      this.refresher$.pipe(
        switchMap((_) =>
          this.stopService.arrivals(s).pipe(
            switchMap((predictions) =>
              this.lineFilter$.pipe(
                tap(console.log),
                map((f) => {
                  if (!f) {
                    return predictions;
                  }
                  return predictions.filter((p) => p.lineId === f);
                }),
              ),
            ),
            map((data) => ({ state: 'done', data }) as ArrivalsVM),
            catchError((err) => {
              console.error('Unable to find live arrivals', err);
              return of({ state: 'error', error: err } as ArrivalsVM);
            }),
          ),
        ),
      ),
    ),
    tap(console.log),
  );
}

type DetailsVM =
  | ViewStateDone<StopListItem>
  | ViewStateLoading
  | ViewStateError;
type ArrivalsVM = ViewStateDone<StopArrival[]> | ViewStateError;
