import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { ErrorComponent } from '../../../components/error/error.component';

@Component({
  selector: 'app-bus-find-route',
  templateUrl: './find-route.component.html',
  styleUrl: './find-route.component.scss',
  imports: [
    MatInputModule,
    MatFormField,
    ReactiveFormsModule,
    CommonModule,
    BusRouteSearchResultComponent,
    RouterModule,
    LoadingComponent,
    ErrorComponent,
  ],
})
export class FindRouteComponent {
  busRouteService = inject(BusRouteService);

  searchControl = new FormControl('', {
    nonNullable: true,
    // validators: [Validators.required],
  });

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
            return of({ state: 'error', error: err } as VM);
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
