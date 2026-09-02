import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Vehicle } from '../../models/fleet.model';

@Component({
  selector: 'app-edit-vehicle-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-vehicle-modal.component.html',
  styleUrl: './edit-vehicle-modal.component.scss'
})
export class EditVehicleModalComponent implements OnInit, OnChanges {
  @Input() vehicle!: Vehicle;
  @Output() closeModal = new EventEmitter<void>();
  @Output() updateVehicle = new EventEmitter<{ id: number; data: Partial<Vehicle> }>();

  editForm!: FormGroup;
  submitted = false;

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['vehicle'] && this.editForm) {
      this.initForm();
    }
  }

  private initForm(): void {
    const v = this.vehicle || ({} as Partial<Vehicle>);
    this.editForm = new FormGroup({
      driverName: new FormControl(v.driverName || '', [Validators.required, Validators.minLength(3)]),
      vehicleModel: new FormControl(v.vehicleModel || '', [Validators.required, Validators.minLength(2)]),
      category: new FormControl(v.category || 'FAVORITOS', [Validators.required]),
      status: new FormControl(v.status || 'EN CAMINO', [Validators.required]),
      licensePlate: new FormControl(v.licensePlate || '6TRJ244', [Validators.required]),
      payload: new FormControl(v.payload || '2,885 lbs (1,308 kg)'),
      loadVolume: new FormControl(v.loadVolume || '0.55 in³ (5.8 m³)'),
      loadLength: new FormControl(v.loadLength || '117 in (2.97 m)'),
      loadWidth: new FormControl(v.loadWidth || '67 in (1.70 m)'),
    });
  }

  get f() {
    return this.editForm.controls;
  }

  onClose(): void {
    this.closeModal.emit();
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.editForm.invalid) {
      return;
    }

    const val = this.editForm.value;
    this.updateVehicle.emit({
      id: this.vehicle.id,
      data: {
        driverName: val.driverName,
        vehicleModel: val.vehicleModel,
        category: val.category,
        status: val.status,
        licensePlate: val.licensePlate.toUpperCase(),
        payload: val.payload,
        loadVolume: val.loadVolume,
        loadLength: val.loadLength,
        loadWidth: val.loadWidth,
      }
    });
  }
}
