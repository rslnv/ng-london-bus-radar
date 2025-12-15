import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { FindRouteComponent } from './bus/containers/find-route/find-route.component';
import { RouteDetailsComponent } from './bus/containers/route-details/route-details.component';
import { ListFavouritesComponent } from './favourites/containers/list-favourites.component';
import { FavouritesStore } from './favourites/services/favourites.store';
import { StopArrivalsComponent } from './stop/containers/arrivals/arrivals.component';
import { FindStopComponent } from './stop/containers/find-stop/find-stop.component';

export const routes: Routes = [
  {
    path: 'bus/:routeId/:direction',
    loadComponent: () =>
      import('./bus/containers/route-details/route-details.component').then(
        (c) => c.RouteDetailsComponent,
      ),
  },
  {
    path: 'bus/:routeId',
    redirectTo: ({ params }) => {
      return `bus/${params['routeId']}/outbound`;
    },
  },
  { path: 'bus', component: FindRouteComponent },
  { path: 'stop/:stopId/:lineId', component: StopArrivalsComponent },
  { path: 'stop/:stopId', component: StopArrivalsComponent },
  { path: 'stop', component: FindStopComponent },
  { path: 'favourites', component: ListFavouritesComponent },
  {
    path: 'map',
    loadComponent: () =>
      import('./map/containers/map-search/map-search.component').then(
        (c) => c.MapSearchComponent,
      ),
  },
  {
    path: '',
    redirectTo: () => {
      const favouritesStore = inject(FavouritesStore);
      return favouritesStore.any() ? 'favourites' : 'stop';
    },
    pathMatch: 'full',
  },
];
