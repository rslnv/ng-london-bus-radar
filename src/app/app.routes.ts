import { Routes } from '@angular/router';
import { FindRouteComponent } from './bus/containers/find-route/find-route.component';
import { RouteDetailsComponent } from './bus/containers/route-details/route-details.component';

export const routes: Routes = [
  { path: '', component: FindRouteComponent },
  { path: 'bus/:routeId/direction/:direction', component: RouteDetailsComponent },
];
