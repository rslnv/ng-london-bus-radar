import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { iif, merge, Observable, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  startWith,
  switchMap,
  takeUntil,
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
import { StopListItem } from '../../../models/stop-list-item';
import { SearchInput } from '../../models/search-input';

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
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  providers: [StopService],
})
export class FindStopComponent {
  private stopService = inject(StopService);

  searchControl = new FormControl('', {
    nonNullable: true,
    validators: [
      // Validators.required,
      Validators.minLength(4),
    ],
  });

  private static getSearchInput(searchTerm: string): SearchInput {
    searchTerm = searchTerm.trim();

    if (!searchTerm.length) {
      return { type: 'empty' };
    }

    const smsCodeRegExp = /^\d{5}$/;
    if (smsCodeRegExp.test(searchTerm)) {
      return { type: 'smsCode', smsCode: searchTerm };
    }

    const coords = FindStopComponent.parseCoords(searchTerm);
    if (coords !== null) {
      return {
        ...coords,
        type: 'location',
      };
    }

    return { type: 'name', name: searchTerm };
  }

  private static parseCoords(searchTerm: string): {
    latitude: number;
    longitude: number;
  } | null {
    const segments = searchTerm.split(',');

    if (segments.length !== 2) {
      return null;
    }

    const latitude = +segments[0].trim();
    if (Number.isNaN(latitude)) {
      return null;
    }

    const longitude = +segments[1].trim();
    if (Number.isNaN(longitude)) {
      return null;
    }

    return { latitude, longitude };
  }

  private input$: Observable<SearchInput> =
    this.searchControl.valueChanges.pipe(
      filter((_) => this.searchControl.valid),
      debounceTime(500),
      distinctUntilChanged(),
      map((searchTerm) => FindStopComponent.getSearchInput(searchTerm)),
      tap(console.log),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

  private findEmpty$ = this.input$.pipe(
    filter((input) => input.type === 'empty'),
    map((_) => ({ state: 'idle' }) as VM),
  );

  private findByName$ = this.input$.pipe(
    filter((input) => input.type === 'name'),
    switchMap((input) =>
      this.stopService.findByName(input.name).pipe(
        map((data) => ({ state: 'done', data }) as VM),
        catchError((err) => {
          console.error('Unable to find bus stops by name', err);
          return of({ state: 'error', error: err } as VM);
        }),
        startWith({ state: 'loading' } as VM),
      ),
    ),
  );

  private findBySmsCode$ = this.input$.pipe(
    filter((input) => input.type === 'smsCode'),
    switchMap((input) =>
      this.stopService.findBySmsCode(input.smsCode).pipe(
        map((data) => ({ state: 'done', data }) as VM),
        catchError((err) => {
          console.error('Unable to find bus stops by SMS code', err);
          return of({ state: 'error', error: err } as VM);
        }),
        startWith({ state: 'loading' } as VM),
      ),
    ),
  );

  private findByLocation$ = this.input$.pipe(
    filter((input) => input.type === 'location'),
    switchMap((input) =>
      this.stopService
        .findByLocation(input.latitude, input.longitude, 400)
        .pipe(
          map((data) => ({ state: 'done', data }) as VM),
          catchError((err) => {
            console.error('Unable to find bus stops by SMS code', err);
            return of({ state: 'error', error: err } as VM);
          }),
          startWith({ state: 'loading' } as VM),
        ),
    ),
  );

  viewModel$ = merge(
    this.findEmpty$,
    this.findByName$,
    this.findBySmsCode$,
    this.findByLocation$,
  ).pipe(startWith({ state: 'idle' } as VM));
}

type VM =
  | ViewStateDone<StopListItem[]>
  | ViewStateIdle
  | ViewStateLoading
  | ViewStateError;
