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

    const smsCodeRegExp = /^\d{5}$/;

    if (!searchTerm.length) {
      return { type: 'empty', term: searchTerm };
    } else if (smsCodeRegExp.test(searchTerm)) {
      return { type: 'smsCode', term: searchTerm };
    } else {
      return { type: 'name', term: searchTerm };
    }
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
      this.stopService.find(input.term).pipe(
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
      this.stopService.findBySmsCode(input.term).pipe(
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
  ).pipe(startWith({ state: 'idle' } as VM));
}

type VM =
  | ViewStateDone<StopListItem[]>
  | ViewStateIdle
  | ViewStateLoading
  | ViewStateError;
