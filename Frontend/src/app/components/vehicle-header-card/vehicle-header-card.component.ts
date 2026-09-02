import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vehicle } from '../../models/fleet.model';
import { DocumentsModalComponent } from '../documents-modal/documents-modal.component';

@Component({
  selector: 'app-vehicle-header-card',
  standalone: true,
  imports: [CommonModule, DocumentsModalComponent],
  templateUrl: './vehicle-header-card.component.html',
  styleUrl: './vehicle-header-card.component.scss'
})
export class VehicleHeaderCardComponent {
  @Input() vehicle: Vehicle | null = null;
  @Output() editVehicle = new EventEmitter<Vehicle>();
  @Output() deleteVehicle = new EventEmitter<Vehicle>();

  isDocsModalOpen = false;
  isMenuOpen = false;

  get avatarUrl(): string {
    if (this.vehicle?.avatarUrl) return this.vehicle.avatarUrl;
    return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80';
  }

  get vehicleImageUrl(): string {
    // Usamos la imagen oficial de alta resolución van.jpg
    if (this.vehicle?.vehicleImageUrl && !this.vehicle.vehicleImageUrl.includes('unsplash')) {
      return this.vehicle.vehicleImageUrl;
    }
    return '/van.jpg';
  }

  onEdit(): void {
    this.isMenuOpen = false;
    if (this.vehicle) this.editVehicle.emit(this.vehicle);
  }

  onDelete(): void {
    this.isMenuOpen = false;
    if (this.vehicle) this.deleteVehicle.emit(this.vehicle);
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  openDocs(): void {
    this.isDocsModalOpen = true;
  }

  closeDocs(): void {
    this.isDocsModalOpen = false;
  }

  onSendMessage(): void {
    alert(`Abriendo conversación con ${this.vehicle?.driverName || 'el conductor'}...`);
  }

  onCallDriver(): void {
    alert(`Llamando a ${this.vehicle?.driverName || 'el conductor'}...`);
  }
}
