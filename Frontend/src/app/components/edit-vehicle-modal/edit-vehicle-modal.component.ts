import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Vehicle } from '../../models/fleet.model';

@Component({
  selector: 'app-edit-vehicle-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-vehicle-modal.component.html',
  styleUrl: './edit-vehicle-modal.component.scss'
})
export class EditVehicleModalComponent implements OnInit {
  @Input() vehicle!: Vehicle;
  @Output() closeModal = new EventEmitter<void>();
  @Output() updateVehicle = new EventEmitter<{ id: number; data: Partial<Vehicle> }>();

  driverName = '';
  vehicleModel = '';
  category = 'VANS';
  status = 'ON THE WAY';
  payload = '';
  loadVolume = '';
  licensePlate = '';

  ngOnInit(): void {
    if (this.vehicle) {
      this.driverName = this.vehicle.driverName;
      this.vehicleModel = this.vehicle.vehicleModel;
      this.category = this.vehicle.category;
      this.status = this.vehicle.status;
      this.payload = this.vehicle.payload || '2,885 lbs';
      this.loadVolume = this.vehicle.loadVolume || '0.55 in³';
      this.licensePlate = this.vehicle.licensePlate || '6TRJ244';
    }
  }

  onClose(): void {
    this.closeModal.emit();
  }

  onSubmit(): void {
    if (!this.driverName || !this.vehicleModel) return;
    this.updateVehicle.emit({
      id: this.vehicle.id,
      data: {
        driverName: this.driverName,
        vehicleModel: this.vehicleModel,
        category: this.category,
        status: this.status,
        payload: this.payload,
        loadVolume: this.loadVolume,
        licensePlate: this.licensePlate
      }
    });
  }
}
