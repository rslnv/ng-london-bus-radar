import { Routes } from '@angular/router';
import { FindRouteComponent } from './bus/containers/find-route/find-route.component';
import { RouteDetailsComponent } from './bus/containers/route-details/route-details.component';
import { StopArrivalsComponent } from './stop/containers/arrivals/arrivals.component';
import { FindStopComponent } from './stop/containers/find-stop/find-stop.component';

export const routes: Routes = [
  { path: '', component: FindRouteComponent },
  {
    path: 'bus/:routeId',
    redirectTo: ({ params }) => {
      return `bus/${params['routeId']}/outbound`;
    },
  },
  { path: 'bus/:routeId/:direction', component: RouteDetailsComponent },
  { path: 'stop/:stopId/:lineId', component: StopArrivalsComponent },
  { path: 'stop/:stopId', component: StopArrivalsComponent },
  { path: 'stop', component: FindStopComponent },
];
