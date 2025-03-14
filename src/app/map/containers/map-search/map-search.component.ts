import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  of,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  tap,
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
import { LatLonZoom } from '../../models/lat-lon-zoom';
import { MapHelperService } from '../../services/map-helper.service';

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
        [startingLocation]="startingLocation"
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
  private mapHelperService = inject(MapHelperService);
  startingLocation = this.mapHelperService.location;

  moveSubject = new Subject<LatLonZoom>();

  viewModel$ = this.moveSubject.pipe(
    debounceTime(500),
    map((latLonZoom) => ({
      latitude: latLonZoom.latitude,
      longitude: latLonZoom.longitude,
      radius: MapHelperService.zoomToRadius(latLonZoom.zoom),
    })),
    distinctUntilChanged(MapHelperService.latLonRadiusComparer),
    tap(
      (x) =>
        (this.mapHelperService.location = {
          latitude: x.latitude,
          longitude: x.longitude,
        }),
    ),
    switchMap((move) =>
      this.stopService
        .findByLocation(move.latitude, move.longitude, move.radius)
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
