import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormField } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
  map,
  startWith,
  catchError,
} from 'rxjs/operators';
import { BusRouteService } from '../../services/bus-route.service';
import { BusRouteSearchResult } from '../../models/bus-route-search-result';
import { iif, Observable, of } from 'rxjs';
import { BusRouteSearchResultComponent } from '../../components/bus-route-search-result/bus-route-search-result.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-bus-find-route',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormField,
    ReactiveFormsModule,
    CommonModule,
    BusRouteSearchResultComponent,
    RouterModule,
  ],
  providers: [BusRouteService],
  templateUrl: './find-route.component.html',
  styleUrl: './find-route.component.scss',
})
export class FindRouteComponent {
  busRouteService = inject(BusRouteService);

  searchControl = new FormControl('', { nonNullable: true });

  private data$: Observable<ViewModel<BusRouteSearchResult[]>> =
    this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((searchTerm) =>
        iif(
          () => !searchTerm,
          of({ state: 'idle' } as VM),
          this.busRouteService.FindRoute(searchTerm).pipe(
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

  viewModel$ = this.data$.pipe(
    startWith({ state: 'idle' } as ViewModel<BusRouteSearchResult[]>),
  );
}

type VM = ViewModel<BusRouteSearchResult[]>;

type ViewModel<T> =
  | ViewModelDone<T>
  | ViewModelIdle
  | ViewModelLoading
  | ViewModelError;

type ViewModelDone<T> = {
  state: 'done';
  data: T;
};
type ViewModelLoading = {
  state: 'loading';
};
type ViewModelIdle = {
  state: 'idle';
};
type ViewModelError = {
  state: 'error';
  message: string | undefined;
};
