import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private fleetService = inject(FleetService);
  private cdr = inject(ChangeDetectorRef);

  activeNav = 'van';
  vehicles: Vehicle[] = [];
  selectedVehicle: Vehicle | null = null;
  routes: RouteItem[] = [];
  driverStats: DriverStats | null = null;

  isAddModalOpen = false;
  isEditModalOpen = false;
  isDeleteModalOpen = false;
  vehicleToDelete: Vehicle | null = null;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.fleetService.getVehicles().subscribe({
      next: (data) => {
        this.vehicles = [...data];
        if (!this.selectedVehicle && data.length > 0) {
          const defaultSelected = data.find((v) => v.driverName === 'James Lubin') || data[0];
          this.selectedVehicle = defaultSelected;
          this.loadRoutesForVehicle(defaultSelected.id);
        } else if (this.selectedVehicle) {
          const updatedSelected = data.find((v) => v.id === this.selectedVehicle?.id);
          if (updatedSelected) {
            this.selectedVehicle = updatedSelected;
          } else {
            this.selectedVehicle = data[0] || null;
            if (this.selectedVehicle) {
              this.loadRoutesForVehicle(this.selectedVehicle.id);
            }
          }
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar vehículos:', err);
        this.cdr.detectChanges();
      }
    });

    this.fleetService.getDriverStats().subscribe({
      next: (s) => {
        this.driverStats = s;
        this.cdr.detectChanges();
      },
      error: () => this.cdr.detectChanges()
    });
  }

  loadRoutesForVehicle(vehicleId?: number): void {
    this.fleetService.getRoutes(vehicleId).subscribe({
      next: (r) => {
        this.routes = [...r];
        this.cdr.detectChanges();
      },
      error: () => this.cdr.detectChanges()
    });
  }

  onNavChange(nav: string): void {
    this.activeNav = nav;
    this.cdr.detectChanges();
  }

  onSelectVehicle(vehicle: Vehicle): void {
    this.selectedVehicle = vehicle;
    this.loadRoutesForVehicle(vehicle.id);
    this.cdr.detectChanges();
  }

  openAddModal(): void {
    this.isAddModalOpen = true;
    this.cdr.detectChanges();
  }

  openEditModal(): void {
    if (this.selectedVehicle) {
      this.isEditModalOpen = true;
      this.cdr.detectChanges();
    }
  }

  closeModals(): void {
    this.isAddModalOpen = false;
    this.isEditModalOpen = false;
    this.isDeleteModalOpen = false;
    this.vehicleToDelete = null;
    this.cdr.detectChanges();
  }

  onSaveVehicle(newVehicleData: Partial<Vehicle>): void {
    // Cerrar modal al instante
    this.closeModals();

    // Guardar en la base de datos PostgreSQL
    this.fleetService.addVehicle(newVehicleData).subscribe({
      next: (saved) => {
        // Actualizamos de inmediato en memoria
        const exists = this.vehicles.some(v => v.id === saved.id);
        if (!exists) {
          this.vehicles = [...this.vehicles, saved];
        } else {
          this.vehicles = this.vehicles.map(v => v.id === saved.id ? saved : v);
        }
        this.selectedVehicle = saved;
        this.loadRoutesForVehicle(saved.id);
        this.cdr.detectChanges();

        // Refrescar sincronizado desde backend PostgreSQL para asegurar consistencia
        this.fleetService.getVehicles().subscribe((data) => {
          this.vehicles = [...data];
          const matched = this.vehicles.find(v => v.id === saved.id) || saved;
          this.selectedVehicle = matched;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error('Error al guardar vehículo:', err);
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
        this.cdr.detectChanges();
      }
    });
  }

  onUpdateVehicle(event: { id: number; data: Partial<Vehicle> }): void {
    this.closeModals();
    this.fleetService.updateVehicle(event.id, event.data).subscribe({
      next: (updated) => {
        this.vehicles = this.vehicles.map((v) => (v.id === event.id ? { ...v, ...updated } : v));
        if (this.selectedVehicle?.id === event.id) {
          this.selectedVehicle = { ...this.selectedVehicle, ...updated };
        }
        this.cdr.detectChanges();

        // Refrescar sincronizado desde backend PostgreSQL
        this.fleetService.getVehicles().subscribe((data) => {
          this.vehicles = [...data];
          const matched = this.vehicles.find(v => v.id === event.id);
          if (matched && this.selectedVehicle?.id === event.id) {
            this.selectedVehicle = matched;
          }
          this.cdr.detectChanges();
        });
      },
      error: () => this.cdr.detectChanges()
    });
  }

  onDeleteVehicle(vehicle: Vehicle): void {
    this.vehicleToDelete = vehicle;
    this.isDeleteModalOpen = true;
    this.cdr.detectChanges();
  }

  cancelDelete(): void {
    this.isDeleteModalOpen = false;
    this.vehicleToDelete = null;
    this.cdr.detectChanges();
  }

  confirmDeleteVehicle(): void {
    if (!this.vehicleToDelete) return;
    const vehicleId = this.vehicleToDelete.id;
    this.isDeleteModalOpen = false;
    this.vehicleToDelete = null;

    // Actualización inmediata en UI
    this.vehicles = this.vehicles.filter((v) => v.id !== vehicleId);
    if (this.selectedVehicle?.id === vehicleId) {
      this.selectedVehicle = this.vehicles[0] || null;
      if (this.selectedVehicle) {
        this.loadRoutesForVehicle(this.selectedVehicle.id);
      } else {
        this.routes = [];
      }
    }
    this.cdr.detectChanges();

    // Eliminar en backend PostgreSQL
    this.fleetService.deleteVehicle(vehicleId).subscribe({
      next: () => {
        // Refrescar sincronizado desde backend PostgreSQL
        this.fleetService.getVehicles().subscribe((data) => {
          this.vehicles = [...data];
          if (this.selectedVehicle && !this.vehicles.some(v => v.id === this.selectedVehicle?.id)) {
            this.selectedVehicle = this.vehicles[0] || null;
            if (this.selectedVehicle) {
              this.loadRoutesForVehicle(this.selectedVehicle.id);
            } else {
              this.routes = [];
            }
          }
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error('Error al eliminar vehículo:', err);
        this.cdr.detectChanges();
      }
    });
  }

  onAssignNewRoute(newRouteData: Partial<RouteItem>): void {
    const routeWithVehicle: Partial<RouteItem> & { vehicleId?: number } = {
      ...newRouteData,
      vehicleId: this.selectedVehicle?.id
    };
    this.fleetService.addRoute(routeWithVehicle).subscribe({
      next: (saved) => {
        this.routes = [saved, ...this.routes];
        this.cdr.detectChanges();
        if (this.selectedVehicle?.id) {
          this.loadRoutesForVehicle(this.selectedVehicle.id);
        }
      },
      error: () => this.cdr.detectChanges()
    });
  }
}

