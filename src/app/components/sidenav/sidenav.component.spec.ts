import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SidenavComponent } from './sidenav.component';
import {
  inputBinding,
  provideZonelessChangeDetection,
  signal,
} from '@angular/core';
import { ActivatedRoute, provideRouter, Routes } from '@angular/router';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
      imports: [NoopAnimationsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    const isHandsetSignal = signal(true);
    const showFavouritesSignal = signal(false);

    fixture = TestBed.createComponent(SidenavComponent, {
      bindings: [
        inputBinding('isHandset', () => isHandsetSignal),
        inputBinding('showFavourites', () => showFavouritesSignal),
      ],
    });
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
