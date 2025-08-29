import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { map, Observable, shareReplay } from 'rxjs';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { FavouritesStore } from './favourites/services/favourites.store';
import { VersionService } from './services/version.service';

@Component({
  selector: 'app-root',
  styleUrl: './app.component.scss',
  templateUrl: './app.component.html',
  imports: [AsyncPipe, RouterOutlet, SidenavComponent],
})
export class AppComponent {
  favouritesStore = inject(FavouritesStore);
  versionService = inject(VersionService);

  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

  version = toSignal(this.versionService.sha());
}
