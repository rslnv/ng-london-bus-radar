import { JsonPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bus-route-details',
  templateUrl: './route-details.component.html',
  imports: [JsonPipe, CommonModule],
  standalone: true,
})
export class RouteDetailsComponent {
  route = inject(ActivatedRoute);

  data$ = this.route.paramMap;
}
