import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-bus-find-route',
  standalone: true,
  imports: [MatInputModule, MatFormField, ReactiveFormsModule, CommonModule],
  providers: [BusRouteService],
  templateUrl: './find-route.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FindRouteComponent {
  busRouteService = inject(BusRouteService);

  searchControl = new FormControl('', { nonNullable: true });

  private data$: Observable<ViewModel> = this.searchControl.valueChanges.pipe(
    debounceTime(500),
    distinctUntilChanged(),
    switchMap((x) =>
      iif(
        () => !x,
        of({ state: 'idle' } as ViewModel),
        this.busRouteService.FindRoute(x).pipe(
          map((x) => {
            return { state: 'done', data: x } as ViewModel;
          }),
          catchError((err) => {
            console.error('Unable to find bus routes', err);
            return of({ state: 'error', message: err.message } as ViewModel);
          }),
          startWith({ state: 'loading' } as ViewModel),
        ),
      ),
    ),
    tap((x) => console.log('Current state', x)),
  );

  viewModel$ = this.data$.pipe(startWith({ state: 'idle' } as ViewModel));

  // private _viewModel = toSignal(this.data$, {
  //   initialValue: { state: 'idle' } as ViewModel,
  // });
  // // hack to work around issues with Type narrowing of signals in templates
  // get viewModel() {
  //   return this._viewModel();
  // }
}

type ViewModel =
  | ViewModelDone
  | ViewModelIdle
  | ViewModelLoading
  | ViewModelError;

type ViewModelDone = {
  state: 'done';
  data: BusRouteSearchResult[];
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
