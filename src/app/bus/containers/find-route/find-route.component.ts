import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { iif, Observable, of } from 'rxjs';
import {
    catchError,
    debounceTime,
    distinctUntilChanged,
    map,
    startWith,
    switchMap,
    tap,
} from 'rxjs/operators';
import { LoadingComponent } from '../../../components/loading/loading.component';
import {
    ViewStateDone,
    ViewStateError,
    ViewStateIdle,
    ViewStateLoading,
} from '../../../models/view-state';
import { BusRouteSearchResultComponent } from '../../components/bus-route-search-result/bus-route-search-result.component';
import { BusRouteSearchResult } from '../../models/bus-route-search-result';
import { BusRouteService } from '../../services/bus-route.service';

@Component({
  selector: 'app-bus-find-route',
  templateUrl: './find-route.component.html',
  styleUrl: './find-route.component.scss',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormField,
    ReactiveFormsModule,
    CommonModule,
    BusRouteSearchResultComponent,
    RouterModule,
    LoadingComponent,
  ],
  providers: [BusRouteService],
})
export class FindRouteComponent {
  busRouteService = inject(BusRouteService);

  searchControl = new FormControl('', { nonNullable: true });

  private data$: Observable<VM> = this.searchControl.valueChanges.pipe(
    debounceTime(500),
    distinctUntilChanged(),
    switchMap((searchTerm) =>
      iif(
        () => !searchTerm,
        of({ state: 'idle' } as VM),
        this.busRouteService.find(searchTerm).pipe(
          map((data) => ({ state: 'done', data }) as VM),
          catchError((err) => {
            console.error('Unable to find bus routes', err);
            return of({ state: 'error', message: err.message } as VM);
          }),
          startWith({ state: 'loading' } as VM),
        ),
      ),
    ),
    tap((x) => console.log('Current state', x)),
  );

  viewModel$ = this.data$.pipe(startWith({ state: 'idle' } as VM));
}

type VM =
  | ViewStateDone<BusRouteSearchResult[]>
  | ViewStateIdle
  | ViewStateLoading
  | ViewStateError;
