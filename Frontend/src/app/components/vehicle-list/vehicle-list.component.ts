import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Vehicle } from '../../models/fleet.model';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-list.component.html',
  styleUrl: './vehicle-list.component.scss'
})
export class VehicleListComponent {
  @Input() vehicles: Vehicle[] = [];
  @Input() selectedVehicle: Vehicle | null = null;

  @Output() selectVehicle = new EventEmitter<Vehicle>();
  @Output() openAddModal = new EventEmitter<void>();

  searchQuery = '';
  expandedFavorites = true;
  expandedTrucks = true;
  expandedVans = true;

  get favorites(): Vehicle[] {
    return this.filterVehicles(this.vehicles.filter(v => v.category === 'FAVORITES'));
  }

  get trucks(): Vehicle[] {
    return this.filterVehicles(this.vehicles.filter(v => v.category === 'TRUCKS'));
  }

  get vans(): Vehicle[] {
    return this.filterVehicles(this.vehicles.filter(v => v.category === 'VANS'));
  }

  private filterVehicles(list: Vehicle[]): Vehicle[] {
    if (!this.searchQuery.trim()) return list;
    const q = this.searchQuery.toLowerCase();
    return list.filter(v => 
      v.driverName.toLowerCase().includes(q) || 
      v.vehicleModel.toLowerCase().includes(q)
    );
  }

  onSelect(vehicle: Vehicle): void {
    this.selectVehicle.emit(vehicle);
  }

  onAddClick(): void {
    this.openAddModal.emit();
  }

  getAvatar(driverName: string): string {
    const avatars: Record<string, string> = {
      'Nolan Dokidis': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      'Ahmad Mango': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      'James Lubin': 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      'Talan Dorwart': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
      'Jakob Vetrovs': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
      'Zain Vetrovs': 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
      'Jaylon Rhiel Madsen': 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=100&auto=format&fit=crop&q=80',
      'Gustavo Torff': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
      'Tiana Westervelt': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      'Zain Korsgaard': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80'
    };
    return avatars[driverName] || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80';
  }
}
