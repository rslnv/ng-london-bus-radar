import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  defer,
  EMPTY,
  Observable,
  of,
  OperatorFunction,
  pipe,
  Subject,
} from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
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
import { LocationService } from '../../../services/location.service';
import { PostcodeService } from '../../../services/postcode.service';
import { SearchInputComponent } from '../../components/search-input/search-input.component';
import { SearchRadiusComponent } from '../../components/search-input/search-radius.component';
import { SearchInput } from '../../models/search-input';
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
  private input$: Observable<SearchInput> = this.inputSubject.pipe(
    tap(console.log),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  showRadiusControl$ = this.input$.pipe(
    map((input) =>
      ['postcode', 'coordinates', 'currentPosition'].includes(input.type),
    ),
  );

  radiusSubject = new BehaviorSubject<number>(0);
  private radius$ = this.radiusSubject.pipe(
    distinctUntilChanged(),
    tap(console.log),
  );

  private mapToVM = (): OperatorFunction<StopListItem[], VM> =>
    pipe(
      map((data) => ({ state: 'done', data }) as VM),
      catchError((err) => of({ state: 'error', error: err } as VM)),
      startWith({ state: 'loading' } as VM),
    );

  private findByName = (name: string): Observable<VM> =>
    this.stopService.findByName(name).pipe(this.mapToVM());

  private findBySmsCode = (smsCode: string): Observable<VM> =>
    this.stopService.findBySmsCode(smsCode).pipe(this.mapToVM());

  private findByPostcode = (postcode: string, radius: number): Observable<VM> =>
    this.postcodeService.find(postcode).pipe(
      switchMap((postcode) =>
        this.stopService.findByLocation(
          postcode.result.latitude,
          postcode.result.longitude,
          radius,
        ),
      ),
      this.mapToVM(),
    );

  private findByCoordinates = (
    latitude: number,
    longitude: number,
    radius: number,
  ) => this.stopService.findByLocation(latitude, longitude, radius);

  private findByCurrentPosition = (radius: number) =>
    this.locationService.currentPostition.pipe(
      switchMap((position) =>
        this.stopService.findByLocation(
          position.coords.latitude,
          position.coords.longitude,
          radius,
        ),
      ),
      this.mapToVM(),
    );

  viewModel$ = combineLatest({
    input: this.input$,
    radius: this.radius$,
  }).pipe(
    switchMap((query) =>
      defer(() => {
        if (query.input.type === 'empty') {
          return of({ state: 'idle' } as VM);
        } else if (query.input.type === 'name') {
          return this.findByName(query.input.name);
        } else if (query.input.type === 'smsCode') {
          return this.findBySmsCode(query.input.smsCode);
        } else if (query.input.type === 'postcode' && query.radius) {
          return this.findByPostcode(query.input.postcode, query.radius);
        } else if (query.input.type === 'coordinates' && query.radius) {
          return this.findByCoordinates(
            query.input.latitude,
            query.input.longitude,
            query.radius,
          );
        } else if (query.input.type === 'currentPosition' && query.radius) {
          return this.findByCurrentPosition(query.radius);
        } else {
          return EMPTY;
        }
      }),
    ),
    tap(console.log),
    startWith({ state: 'idle' } as VM),
  );
}

type VM =
  | ViewStateDone<StopListItem[]>
  | ViewStateIdle
  | ViewStateLoading
  | ViewStateError;
