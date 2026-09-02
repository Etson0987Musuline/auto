import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { SidebarComponent } from './components/sidebar/sidebar.component';
import { VehicleListComponent } from './components/vehicle-list/vehicle-list.component';
import { VehicleHeaderCardComponent } from './components/vehicle-header-card/vehicle-header-card.component';
import { RoutesCardComponent } from './components/routes-card/routes-card.component';
import { DriverStatsComponent } from './components/driver-stats/driver-stats.component';
import { AddVehicleModalComponent } from './components/add-vehicle-modal/add-vehicle-modal.component';
import { EditVehicleModalComponent } from './components/edit-vehicle-modal/edit-vehicle-modal.component';
import { MessagesViewComponent } from './components/messages-view/messages-view.component';
import { GenericViewComponent } from './components/generic-view/generic-view.component';

import { FleetService } from './services/fleet.service';
import { Vehicle, RouteItem, DriverStats } from './models/fleet.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    SidebarComponent,
    VehicleListComponent,
    VehicleHeaderCardComponent,
    RoutesCardComponent,
    DriverStatsComponent,
    AddVehicleModalComponent,
    EditVehicleModalComponent,
    MessagesViewComponent,
    GenericViewComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private fleetService = inject(FleetService);

  activeNav = 'van';
  vehicles: Vehicle[] = [];
  selectedVehicle: Vehicle | null = null;
  routes: RouteItem[] = [];
  driverStats: DriverStats | null = null;

  dbStatus = { connected: false, message: 'Verificando conexión con PostgreSQL...' };
  isAddModalOpen = false;
  isEditModalOpen = false;

  ngOnInit(): void {
    this.loadData();
    this.checkDb();
  }

  loadData(): void {
    this.fleetService.getVehicles().subscribe((data) => {
      this.vehicles = data;
      const defaultSelected = data.find((v) => v.driverName === 'James Lubin') || data[0];
      if (defaultSelected) {
        this.selectedVehicle = defaultSelected;
        this.loadRoutesForVehicle(defaultSelected.id);
      }
    });

    this.fleetService.getDriverStats().subscribe((s) => (this.driverStats = s));
  }

  loadRoutesForVehicle(vehicleId?: number): void {
    this.fleetService.getRoutes(vehicleId).subscribe((r) => {
      this.routes = r;
    });
  }

  checkDb(): void {
    this.fleetService.checkDbStatus().subscribe((res) => (this.dbStatus = res));
  }

  onNavChange(nav: string): void {
    this.activeNav = nav;
  }

  onSelectVehicle(vehicle: Vehicle): void {
    this.selectedVehicle = vehicle;
    this.loadRoutesForVehicle(vehicle.id);
  }

  openAddModal(): void {
    this.isAddModalOpen = true;
  }

  openEditModal(): void {
    if (this.selectedVehicle) this.isEditModalOpen = true;
  }

  closeModals(): void {
    this.isAddModalOpen = false;
    this.isEditModalOpen = false;
  }

  onSaveVehicle(newVehicleData: Partial<Vehicle>): void {
    // Cerrar modal al instante
    this.closeModals();

    // Guardar en la base de datos PostgreSQL
    this.fleetService.addVehicle(newVehicleData).subscribe({
      next: (saved) => {
        if (!this.vehicles.some(v => v.id === saved.id)) {
          this.vehicles = [...this.vehicles, saved];
        }
        this.selectedVehicle = saved;
        this.loadRoutesForVehicle(saved.id);
      },
      error: () => {
        // Fallback local si la DB estuviera offline
        const fallback: Vehicle = {
          id: Date.now(),
          driverName: newVehicleData.driverName || 'Nuevo Conductor',
          driverIdCode: `236-542-${Math.floor(100 + Math.random() * 900)}`,
          vehicleModel: newVehicleData.vehicleModel || 'Volkswagen Transporter',
          status: newVehicleData.status || 'EN CAMINO',
          category: newVehicleData.category || 'FURGONETAS',
          payload: newVehicleData.payload || '2,885 lbs (1,308 kg)',
          loadVolume: newVehicleData.loadVolume || '0.55 in³ (5.8 m³)',
          loadLength: newVehicleData.loadLength || '117 in (2.97 m)',
          loadWidth: newVehicleData.loadWidth || '67 in (1.70 m)',
          licensePlate: newVehicleData.licensePlate || '6TRJ244',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
          vehicleImageUrl: '/van.jpg'
        };
        this.vehicles = [...this.vehicles, fallback];
        this.selectedVehicle = fallback;
        this.loadRoutesForVehicle(fallback.id);
      }
    });
  }

  onUpdateVehicle(event: { id: number; data: Partial<Vehicle> }): void {
    this.closeModals();
    this.fleetService.updateVehicle(event.id, event.data).subscribe((updated) => {
      this.vehicles = this.vehicles.map((v) => (v.id === event.id ? { ...v, ...updated } : v));
      if (this.selectedVehicle?.id === event.id) {
        this.selectedVehicle = { ...this.selectedVehicle, ...updated };
      }
    });
  }

  onDeleteVehicle(vehicle: Vehicle): void {
    if (confirm(`¿Está seguro de que desea eliminar la unidad de ${vehicle.driverName} de la base de datos?`)) {
      this.fleetService.deleteVehicle(vehicle.id).subscribe(() => {
        this.vehicles = this.vehicles.filter((v) => v.id !== vehicle.id);
        this.selectedVehicle = this.vehicles[0] || null;
        if (this.selectedVehicle) {
          this.loadRoutesForVehicle(this.selectedVehicle.id);
        }
      });
    }
  }

  onAssignNewRoute(newRouteData: Partial<RouteItem>): void {
    this.fleetService.addRoute(newRouteData).subscribe((saved) => {
      this.routes = [saved, ...this.routes];
    });
  }
}
