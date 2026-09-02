import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vehicle } from '../../models/fleet.model';

@Component({
  selector: 'app-vehicle-header-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehicle-header-card.component.html',
  styleUrl: './vehicle-header-card.component.scss'
})
export class VehicleHeaderCardComponent {
  @Input() vehicle: Vehicle | null = null;
  @Output() editVehicle = new EventEmitter<Vehicle>();
  @Output() deleteVehicle = new EventEmitter<Vehicle>();

  get avatarUrl(): string {
    return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80';
  }

  get vehicleImageUrl(): string {
    return 'van.jpg';
  }

  onEdit(): void {
    if (this.vehicle) this.editVehicle.emit(this.vehicle);
  }

  onDelete(): void {
    if (this.vehicle) this.deleteVehicle.emit(this.vehicle);
  }
}
