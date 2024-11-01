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
  filter,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';
import { BusStopComponent } from '../../../components/bus-stop/bus-stop.component';
import { ErrorComponent } from '../../../components/error/error.component';
import { LoadingComponent } from '../../../components/loading/loading.component';
import {
  ViewStateDone,
  ViewStateError,
  ViewStateIdle,
  ViewStateLoading,
} from '../../../models/view-state';
import { StopService } from '../../services/stop.service';

@Component({
  selector: 'app-find-stop',
  standalone: true,
  templateUrl: './find-stop.component.html',
  styleUrl: './find-stop.component.scss',
  imports: [
    BusStopComponent,
    CommonModule,
    ErrorComponent,
    LoadingComponent,
    MatFormField,
    MatInputModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  providers: [StopService],
})
export class FindStopComponent {
  private stopService = inject(StopService);

  searchControl = new FormControl('', { nonNullable: true });

  private data$: Observable<VM> = this.searchControl.valueChanges.pipe(
    filter((searchTerm) => searchTerm.length > 3),
    debounceTime(500),
    distinctUntilChanged(),
    switchMap((searchTerm) =>
      iif(
        () => !searchTerm,
        of({ state: 'idle' } as VM),
        this.stopService.find(searchTerm).pipe(
          map((data) => ({ state: 'done', data }) as VM),
          catchError((err) => {
            console.error('Unable to find bus stops', err);
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
  | ViewStateDone<any[]>
  | ViewStateIdle
  | ViewStateLoading
  | ViewStateError;
