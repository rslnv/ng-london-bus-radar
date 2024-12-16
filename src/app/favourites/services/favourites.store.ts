import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { StopDetails } from '../../stop/models/stop-details';

type FavouritesState = {
  items: StopDetails[];
};

const initialState: FavouritesState = {
  items: [],
};

export const FavouritesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed(({ items: favourites }) => ({
    any: computed(() => !!favourites().length),
    // count: computed(() => favourites().length),
    // lastIndex: computed(() => favourites().at(-1)?.id ?? -1),
  })),

  withMethods((store) => ({
    _save(): void {
      const stringValue = JSON.stringify(store.items());
      localStorage.setItem('favourites', stringValue);
    },

    remove(id: string): void {
      patchState(store, (state) => ({
        items: state.items.filter((f) => f.id !== id),
      }));
      this._save();
    },

    add(item: StopDetails): void {
      patchState(store, (state) => ({
        items: [...state.items.filter((x) => x.id !== item.id), item],
      }));
      this._save();
    },

    isPresent(id: string): boolean {
      return store.items().findIndex((f) => f.id === id) >= 0;
    },
  })),

  withHooks({
    onInit(store) {
      let data: StopDetails[] = [];
      try {
        const stringValue = localStorage.getItem('favourites');
        data = JSON.parse(stringValue ?? '');
      } catch {}

      console.log('data', data);
      patchState(store, (state) => ({
        items: data,
      }));
    },
  }),
);
