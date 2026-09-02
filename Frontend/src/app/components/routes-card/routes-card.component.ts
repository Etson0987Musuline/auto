import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteItem } from '../../models/fleet.model';

@Component({
  selector: 'app-routes-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './routes-card.component.html',
  styleUrl: './routes-card.component.scss'
})
export class RoutesCardComponent {
  @Input() routes: RouteItem[] = [];

  activeTab: 'routes' | 'history' = 'routes';

  get activeRoute(): RouteItem | undefined {
    return this.routes.find(r => r.isNowOnWay) || this.routes[0];
  }

  get historyRoutes(): RouteItem[] {
    return this.routes.filter(r => !r.isNowOnWay);
  }
}
