import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { combineLatest, merge, of, Subject } from 'rxjs';
import {
  catchError,
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
import { StopListItem } from '../../../models/stop-list-item';
import {
  ViewStateDone,
  ViewStateError,
  ViewStateIdle,
  ViewStateLoading,
} from '../../../models/view-state';
import { SearchInputComponent } from '../../components/search-input/search-input.component';
import { SearchInput } from '../../models/search-input';
import { StopService } from '../../services/stop.service';
import { LocationService } from '../../../services/location.service';
import { PostcodeService } from '../../../services/postcode.service';
import { SearchRadiusComponent } from '../../components/search-input/search-radius.component';

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
    SearchInputComponent,
    SearchRadiusComponent,
  ],
})
export class FindStopComponent {
  private stopService = inject(StopService);
  private locationService = inject(LocationService);
  private postcodeService = inject(PostcodeService);

  inputSubject = new Subject<SearchInput>();
  private input$ = this.inputSubject.pipe(
    tap(console.log),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  showRadiusControl$ = this.input$.pipe(
    map((input) =>
      ['postcode', 'coordinates', 'currentPosition'].includes(input.type),
    ),
  );

  radiusSubject = new Subject<number>();
  private radius$ = this.radiusSubject.pipe(tap(console.log));

  private findEmpty$ = this.input$.pipe(
    filter((input) => input.type === 'empty'),
    map((_) => ({ state: 'idle' }) as VM),
  );

  private findByName$ = this.input$.pipe(
    filter((input) => input.type === 'name'),
    switchMap((input) =>
      this.stopService.findByName(input.name).pipe(
        map((data) => ({ state: 'done', data }) as VM),
        catchError((err) => of({ state: 'error', error: err } as VM)),
        startWith({ state: 'loading' } as VM),
      ),
    ),
  );

  private findBySmsCode$ = this.input$.pipe(
    filter((input) => input.type === 'smsCode'),
    switchMap((input) =>
      this.stopService.findBySmsCode(input.smsCode).pipe(
        map((data) => ({ state: 'done', data }) as VM),
        catchError((err) => of({ state: 'error', error: err } as VM)),
        startWith({ state: 'loading' } as VM),
      ),
    ),
  );

  private findByPostcode$ = this.input$.pipe(
    filter((input) => input.type === 'postcode'),
    switchMap((input) =>
      this.postcodeService.find(input.postcode).pipe(
        switchMap((postcode) =>
          this.stopService.findByLocation(
            postcode.result.latitude,
            postcode.result.longitude,
            200,
          ),
        ),
        map((data) => ({ state: 'done', data }) as VM),
        catchError((err) => of({ state: 'error', error: err } as VM)),
        startWith({ state: 'loading' } as VM),
      ),
    ),
  );

  private findByCoordinates$ = this.input$.pipe(
    filter((input) => input.type === 'coordinates'),
    switchMap((input) =>
      this.stopService
        .findByLocation(input.latitude, input.longitude, 400)
        .pipe(
          map((data) => ({ state: 'done', data }) as VM),
          catchError((err) => of({ state: 'error', error: err } as VM)),
          startWith({ state: 'loading' } as VM),
        ),
    ),
  );

  private findByCurrentPosition$ = combineLatest({
    input: this.input$,
    radius: this.radius$,
  }).pipe(
    filter((query) => query.input.type === 'currentPosition'),
    switchMap((query) =>
      this.locationService.currentPostition.pipe(
        switchMap((position) =>
          this.stopService.findByLocation(
            position.coords.latitude,
            position.coords.longitude,
            query.radius,
          ),
        ),
        map((data) => ({ state: 'done', data }) as VM),
        catchError((err) => of({ state: 'error', error: err } as VM)),
        startWith({ state: 'loading' } as VM),
      ),
    ),
  );

  // private findByCurrentPosition$ = this.input$.pipe(
  //   filter((input) => input.type === 'currentPosition'),
  //   switchMap((_) =>
  //     this.locationService.currentPostition.pipe(
  //       switchMap((position) =>
  //         this.stopService.findByLocation(
  //           position.coords.latitude,
  //           position.coords.longitude,
  //           200,
  //         ),
  //       ),
  //       map((data) => ({ state: 'done', data }) as VM),
  //       catchError((err) => of({ state: 'error', error: err } as VM)),
  //       startWith({ state: 'loading' } as VM),
  //     ),
  //   ),
  // );

  viewModel$ = merge(
    this.findEmpty$,
    this.findByName$,
    this.findBySmsCode$,
    this.findByPostcode$,
    this.findByCoordinates$,
    this.findByCurrentPosition$,
  ).pipe(tap(console.log), startWith({ state: 'idle' } as VM));
}

type VM =
  | ViewStateDone<StopListItem[]>
  | ViewStateIdle
  | ViewStateLoading
  | ViewStateError;
