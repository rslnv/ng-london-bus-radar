import { Component, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, filter, map, tap } from 'rxjs';
import { SearchInput } from '../../models/search-input';

@Component({
  selector: 'app-search-input',
  styles: `
    * {
      width: 100%;
    }
  `,
  template: `
    <mat-form-field class="full-width" appearance="outline">
      <mat-label>Bus stop</mat-label>
      <input
        matInput
        placeholder="Search for a bus stop..."
        [formControl]="searchControl"
      />

      <button
        mat-icon-button
        matSuffix
        (click)="selectMyLocation()"
        [attr.aria-label]="'Near my location'"
      >
        <mat-icon>my_location</mat-icon>
      </button>

      <mat-hint>by name, SMS code, postocode or coords</mat-hint>

      @if (searchControl.hasError('required')) {
        <mat-error>This field is required</mat-error>
      } @else if (searchControl.hasError('minlength')) {
        <mat-error>Keep typing...</mat-error>
      }
    </mat-form-field>
  `,
  imports: [ReactiveFormsModule, MatInputModule, MatIconButton, MatIcon],
})
export class SearchInputComponent {
  searchInput = output<SearchInput>();

  searchControl = new FormControl('', {
    nonNullable: true,
    validators: [
      // Validators.required,
      Validators.minLength(4),
    ],
  });

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        filter((_) => this.searchControl.valid),
        map((searchTerm) => SearchInputComponent.getSearchInput(searchTerm)),
        tap((value) => this.searchInput.emit(value)),
        takeUntilDestroyed(),
      )
      .subscribe();
  }

  selectMyLocation() {
    this.searchInput.emit({ type: 'currentPosition' });
  }

  private static getSearchInput(searchTerm: string): SearchInput {
    searchTerm = searchTerm.trim();

    if (!searchTerm.length) {
      return { type: 'empty' };
    }

    const smsCodeRegExp = /^\d{5}$/;
    if (smsCodeRegExp.test(searchTerm)) {
      return { type: 'smsCode', smsCode: searchTerm };
    }

    const postcodeRegExp = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i;
    if (postcodeRegExp.test(searchTerm)) {
      return { type: 'postcode', postcode: searchTerm };
    }

    const coords = SearchInputComponent.parseCoords(searchTerm);
    if (coords !== null) {
      return {
        ...coords,
        type: 'coordinates',
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
}
