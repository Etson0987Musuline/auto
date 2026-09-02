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

  dbStatus = { connected: false, message: 'Checking PostgreSQL Connection...' };
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
      }
    });

    this.fleetService.getRoutes().subscribe((r) => (this.routes = r));
    this.fleetService.getDriverStats().subscribe((s) => (this.driverStats = s));
  }

  checkDb(): void {
    this.fleetService.checkDbStatus().subscribe((res) => (this.dbStatus = res));
  }

  onNavChange(nav: string): void {
    this.activeNav = nav;
  }

  onSelectVehicle(vehicle: Vehicle): void {
    this.selectedVehicle = vehicle;
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
    this.fleetService.addVehicle(newVehicleData).subscribe((saved) => {
      this.vehicles = [...this.vehicles, saved];
      this.selectedVehicle = saved;
      this.closeModals();
    });
  }

  onUpdateVehicle(event: { id: number; data: Partial<Vehicle> }): void {
    this.fleetService.updateVehicle(event.id, event.data).subscribe((updated) => {
      this.vehicles = this.vehicles.map((v) => (v.id === event.id ? { ...v, ...updated } : v));
      if (this.selectedVehicle?.id === event.id) {
        this.selectedVehicle = { ...this.selectedVehicle, ...updated };
      }
      this.closeModals();
    });
  }

  onDeleteVehicle(vehicle: Vehicle): void {
    if (confirm(`Are you sure you want to delete ${vehicle.driverName}'s vehicle?`)) {
      this.fleetService.deleteVehicle(vehicle.id).subscribe(() => {
        this.vehicles = this.vehicles.filter((v) => v.id !== vehicle.id);
        this.selectedVehicle = this.vehicles[0] || null;
      });
    }
  }
}
