import { moveItemInArray } from '@angular/cdk/drag-drop';
import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { StopListItem } from '../../models/stop-list-item';

type FavouritesState = {
  items: StopListItem[];
};

const initialState: FavouritesState = {
  items: [],
};

export const FavouritesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed(({ items: favourites }) => ({
    any: computed(() => !!favourites().length),
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

    add(item: StopListItem): void {
      patchState(store, (state) => ({
        items: [...state.items.filter((x) => x.id !== item.id), item],
      }));
      this._save();
    },

    isPresent(id: string): boolean {
      return store.items().findIndex((f) => f.id === id) >= 0;
    },

    setOrder(prevIndex: number, currIndex: number): void {
      patchState(store, (state) => {
        const itemsCopy = [...state.items];
        moveItemInArray(itemsCopy, prevIndex, currIndex);
        return { items: [...itemsCopy] };
      });
      this._save();
    },
  })),

  withHooks({
    onInit(store) {
      let data: StopListItem[] = [];
      try {
        const stringValue = localStorage.getItem('favourites');
        data = JSON.parse(stringValue ?? '');
      } catch {}

      patchState(store, (state) => ({
        items: data,
      }));
    },
  }),
);
