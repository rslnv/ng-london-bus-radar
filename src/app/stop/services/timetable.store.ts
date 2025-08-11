import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { BehaviorSubject, EMPTY, iif, of, switchMap, tap } from 'rxjs';
import { TimetableFilter } from '../models/timetable-filter';
import { TimetableStoreState } from '../models/timetable-store-state';
import { StopService } from './stop.service';

const initialState: TimetableStoreState = {
  _data: [],
  status: 'done',
  error: null,
  filter: { stopId: null, lineId: null },
};

export const TimetableStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ _data: data, filter }) => ({
    timetable: () =>
      data().find(
        (x) => x.stopId === filter().stopId && x.lineId === filter().lineId,
      ),
  })),
  withMethods((store, stopService = inject(StopService)) => {
    const refreshSubject = new BehaviorSubject<void>(undefined);

    const isTimetableLoaded = (filter: TimetableFilter) =>
      store
        ._data()
        .findIndex(
          (x) => x.stopId === filter.stopId && x.lineId === filter.lineId,
        ) >= 0;

    return {
      refresh() {
        console.log('Trying to refresh');
        refreshSubject.next();
      },

      load: rxMethod<TimetableFilter>(
        switchMap((filter) =>
          refreshSubject.pipe(
            tap((_) =>
              patchState(store, () => ({
                status: 'done' as 'done',
                error: null,
                filter: filter,
              })),
            ),
            switchMap((_) =>
              iif(
                () => isTimetableLoaded(filter),
                EMPTY,
                of(filter).pipe(
                  tap((_) => console.log('Loading timetable')),
                  tap(() => patchState(store, { status: 'loading' })),
                  switchMap((query) =>
                    stopService.timetable(query.stopId!, query.lineId!),
                  ),
                  tapResponse({
                    next: (t) =>
                      patchState(store, (state) => ({
                        _data: [...state._data, t],
                        status: 'done' as 'done',
                      })),
                    error: (err) => {
                      console.error('Catching error in store', err);
                      patchState(store, {
                        status: 'error',
                        error: err,
                      });
                    },
                  }),
                ),
              ),
            ),
          ),
        ),
      ),
    };
  }),
);
