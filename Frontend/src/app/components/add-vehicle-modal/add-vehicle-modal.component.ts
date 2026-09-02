import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Vehicle } from '../../models/fleet.model';

@Component({
  selector: 'app-add-vehicle-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-vehicle-modal.component.html',
  styleUrl: './add-vehicle-modal.component.scss'
})
export class AddVehicleModalComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveVehicle = new EventEmitter<Partial<Vehicle>>();

  vehicleForm!: FormGroup;
  submitted = false;

  ngOnInit(): void {
    this.vehicleForm = new FormGroup({
      driverName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      vehicleModel: new FormControl('', [Validators.required, Validators.minLength(2)]),
      category: new FormControl('FAVORITOS', [Validators.required]),
      status: new FormControl('EN CAMINO', [Validators.required]),
      licensePlate: new FormControl('', [Validators.required]),
      payload: new FormControl('2,885 lbs (1,308 kg)'),
      loadVolume: new FormControl('0.55 in³ (5.8 m³)'),
      loadLength: new FormControl('117 in (2.97 m)'),
      loadWidth: new FormControl('67 in (1.70 m)'),
    });
  }

  get f() {
    return this.vehicleForm.controls;
  }

  onClose(): void {
    this.closeModal.emit();
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.vehicleForm.invalid) {
      return;
    }

    const val = this.vehicleForm.value;
    const newVehicle: Partial<Vehicle> = {
      driverName: val.driverName.trim(),
      driverIdCode: `236-542-${Math.floor(100 + Math.random() * 900)}`,
      vehicleModel: val.vehicleModel.trim(),
      category: val.category,
      status: val.status,
      licensePlate: (val.licensePlate || '6TRJ244').trim().toUpperCase(),
      payload: val.payload || '2,885 lbs (1,308 kg)',
      loadVolume: val.loadVolume || '0.55 in³ (5.8 m³)',
      loadLength: val.loadLength || '117 in (2.97 m)',
      loadWidth: val.loadWidth || '67 in (1.70 m)',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      vehicleImageUrl: '/van.jpg',
    };

    this.saveVehicle.emit(newVehicle);
  }
}
