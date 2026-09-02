import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverStats, ChartPoint } from '../../models/fleet.model';

@Component({
  selector: 'app-driver-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './driver-stats.component.html',
  styleUrl: './driver-stats.component.scss'
})
export class DriverStatsComponent {
  @Input() stats: DriverStats | null = null;

  activeFilter = 'W'; // W | M | 6M | Y
  hoveredIndex: number | null = 2; // Default highlight on index 2 (9/12/22) matching image

  setFilter(filter: string): void {
    this.activeFilter = filter;
  }

  onBarHover(index: number | null): void {
    this.hoveredIndex = index;
  }
}
