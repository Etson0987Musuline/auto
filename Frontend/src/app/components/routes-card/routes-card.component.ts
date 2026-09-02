import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouteItem } from '../../models/fleet.model';

@Component({
  selector: 'app-routes-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './routes-card.component.html',
  styleUrl: './routes-card.component.scss'
})
export class RoutesCardComponent implements OnInit {
  @Input() routes: RouteItem[] = [];
  @Output() assignNewRoute = new EventEmitter<Partial<RouteItem>>();

  simulationProgress = 45;
  isSimulating = false;
  simulationInterval: any = null;

  isNewRouteModalOpen = false;
  newRouteOrigin = '';
  newRouteDestination = '';
  newRoutePackages = 120;

  ngOnInit(): void {
    this.simulationProgress = 45;
  }

  get activeRoute(): RouteItem {
    return this.routes.find(r => r.isNowOnWay) || this.routes[0] || this.getDefaultActiveRoute();
  }

  getDefaultActiveRoute(): RouteItem {
    return {
      id: 1,
      routeCode: '107-591',
      packageCount: 138,
      origin: '2972 Westheimer Rd. Santa Ana',
      destination: '270 Rucker Ave',
      distance: '0.62 mi',
      timeLeft: '10 min',
      weight: '2,160 lbs',
      volume: '247 in³',
      status: 'EN CURSO',
      isNowOnWay: true,
    };
  }

  toggleSimulation(): void {
    if (this.isSimulating) {
      this.stopSimulation();
    } else {
      this.startSimulation();
    }
  }

  startSimulation(): void {
    this.isSimulating = true;
    this.simulationInterval = setInterval(() => {
      if (this.simulationProgress < 100) {
        this.simulationProgress += 5;
      } else {
        this.simulationProgress = 100;
        this.stopSimulation();
      }
    }, 800);
  }

  stopSimulation(): void {
    this.isSimulating = false;
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }

  openNewRouteModal(): void {
    this.isNewRouteModalOpen = true;
  }

  closeNewRouteModal(): void {
    this.isNewRouteModalOpen = false;
    this.newRouteOrigin = '';
    this.newRouteDestination = '';
  }

  onSaveNewRoute(): void {
    if (!this.newRouteOrigin.trim() || !this.newRouteDestination.trim()) {
      alert('Por favor ingrese el origen y destino de la ruta.');
      return;
    }
    const newRoute: Partial<RouteItem> = {
      routeCode: `108-${Math.floor(100 + Math.random() * 900)}`,
      packageCount: this.newRoutePackages || 100,
      origin: this.newRouteOrigin,
      destination: this.newRouteDestination,
      distance: '1.25 mi',
      timeLeft: '18 min',
      weight: '1,950 lbs',
      volume: '210 in³',
      status: 'EN CURSO',
      isNowOnWay: true,
      dateLabel: new Date().toLocaleDateString('es-PE'),
    };

    this.assignNewRoute.emit(newRoute);
    this.closeNewRouteModal();
    this.simulationProgress = 10;
  }
}
