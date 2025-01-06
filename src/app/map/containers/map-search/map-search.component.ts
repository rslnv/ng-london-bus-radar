import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  of,
  shareReplay,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';
import { BusStopComponent } from '../../../components/bus-stop/bus-stop.component';
import { ErrorComponent } from '../../../components/error/error.component';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { StopListItem } from '../../../models/stop-list-item';
import {
  ViewStateDone,
  ViewStateError,
  ViewStateLoading,
} from '../../../models/view-state';
import { StopService } from '../../../stop/services/stop.service';
import { MapViewComponent } from '../../components/map-view/map-view.component';
import { MapCenter } from '../../models/map-center';

@Component({
  selector: 'app-map-search',
  styles: `
    app-map-view {
      display: block;
      width: 100%;
      height: 500px;
    }

    .content {
      & > * {
        margin: 0.7em 0;
        display: block;
      }

      div {
        text-align: center;
      }

      app-bus-stop {
        cursor: pointer;
      }
    }
  `,
  template: `
    @let viewModel = viewModel$ | async;
    @if (viewModel) {
      <app-map-view
        [stops]="markers$ | async"
        (mapCenter)="moveSubject.next($event)"
      />
      <div class="content">
        @if (viewModel.state === 'done') {
          @for (stop of viewModel.data; track stop.id) {
            <app-bus-stop [stop]="stop" [routerLink]="['/stop', stop.id]" />
          } @empty {
            <div>No results</div>
          }
        } @else if (viewModel.state === 'loading') {
          <app-loading />
        } @else if (viewModel.state === 'error') {
          <app-error [errorData]="viewModel.error" />
        }
      </div>
    }
  `,
  imports: [
    MapViewComponent,
    CommonModule,
    RouterModule,
    BusStopComponent,
    ErrorComponent,
    LoadingComponent,
  ],
})
export class MapSearchComponent {
  private stopService = inject(StopService);
  moveSubject = new Subject<MapCenter>();
  move$ = this.moveSubject.pipe(
    // filter((x) => x.zoom >= 15),
    distinctUntilChanged(
      (prev, curr) =>
        Math.abs(prev.latitude - curr.latitude) < 0.001 &&
        Math.abs(prev.longitude - curr.longitude) < 0.001 &&
        prev.zoom - curr.zoom < 1,
    ),
    takeUntilDestroyed(),
  );

  // zoom 14 => radius 500
  // zoom 18 => radius 100
  private zoomToRadius(zoom: number) {
    let validZoom = Math.min(18, Math.floor(zoom));
    validZoom = Math.max(14, validZoom);
    const zoomDelta = validZoom - 14;
    const radius = 500 - zoomDelta * 100;
    return radius;
  }

  viewModel$ = this.move$.pipe(
    switchMap((move) =>
      this.stopService
        .findByLocation(
          move.latitude,
          move.longitude,
          this.zoomToRadius(move.zoom),
        )
        .pipe(
          map((data) => ({ state: 'done', data }) as VM),
          catchError((err) => of({ state: 'error', error: err } as VM)),
          startWith({ state: 'loading' } as VM),
        ),
    ),
    startWith({ state: 'loading' } as VM),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  markers$ = this.viewModel$.pipe(
    filter((vm) => vm.state === 'done'),
    map((vm) => vm.data),
  );
}

type VM = ViewStateDone<StopListItem[]> | ViewStateLoading | ViewStateError;
