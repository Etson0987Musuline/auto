import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Vehicle } from '../../models/fleet.model';

@Component({
  selector: 'app-add-vehicle-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-vehicle-modal.component.html',
  styleUrl: './add-vehicle-modal.component.scss'
})
export class AddVehicleModalComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveVehicle = new EventEmitter<Partial<Vehicle>>();

  driverName = '';
  vehicleModel = '';
  category = 'VANS';
  status = 'ON THE WAY';
  licensePlate = '';

  onClose(): void {
    this.closeModal.emit();
  }

  onSubmit(): void {
    if (!this.driverName || !this.vehicleModel) return;
    this.saveVehicle.emit({
      driverName: this.driverName,
      vehicleModel: this.vehicleModel,
      category: this.category,
      status: this.status,
      licensePlate: this.licensePlate || '6TRJ' + Math.floor(100 + Math.random() * 900)
    });
  }
}
