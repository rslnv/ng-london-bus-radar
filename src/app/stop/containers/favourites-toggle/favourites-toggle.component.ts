import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FavouritesStore } from '../../../favourites/services/favourites.store';
import { StopDetails } from '../../models/stop-details';

@Component({
  selector: 'app-favourites-toggle',
  template: `
    <button
      class="refresh"
      mat-icon-button
      aria-label="Refresh arrivals"
      (click)="toggle()"
    >
      <mat-icon [fontIcon]="icon()"></mat-icon>
    </button>
  `,
  imports: [MatIcon, MatButtonModule, CommonModule],
})
export class FavouritesToggleComponent {
  readonly store = inject(FavouritesStore);
  readonly stop = input.required<StopDetails>();

  toggle() {
    const stopId = this.stop().id;
    if (this.store.isPresent(stopId)) {
      this.store.remove(stopId);
    } else {
      this.store.add(this.stop());
    }
  }

  icon = computed(() =>
    this.store.isPresent(this.stop().id) ? 'favorite' : 'favorite_outline',
  );
}
