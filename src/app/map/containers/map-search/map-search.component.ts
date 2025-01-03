import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  catchError,
  filter,
  map,
  of,
  startWith,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { MapViewComponent } from '../../components/map-view/map-view.component';
import { MapCenter } from '../../models/map-center';
import { StopService } from '../../../stop/services/stop.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BusStopComponent } from '../../../components/bus-stop/bus-stop.component';
import {
  ViewStateDone,
  ViewStateError,
  ViewStateLoading,
} from '../../../models/view-state';
import { StopListItem } from '../../../models/stop-list-item';
import { ErrorComponent } from '../../../components/error/error.component';
import { LoadingComponent } from '../../../components/loading/loading.component';

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
        [stops]="viewModel.state === 'done' ? viewModel.data : []"
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
    filter((x) => x.zoom >= 15),
    tap(console.log),
    takeUntilDestroyed(),
  );

  viewModel$ = this.move$.pipe(
    switchMap((move) =>
      this.stopService.findByLocation(move.latitude, move.longitude, 300).pipe(
        map((data) => ({ state: 'done', data }) as VM),
        catchError((err) => of({ state: 'error', error: err } as VM)),
        startWith({ state: 'loading' } as VM),
      ),
    ),
    startWith({ state: 'done', data: [] } as VM),
  );
}

type VM = ViewStateDone<StopListItem[]> | ViewStateLoading | ViewStateError;
