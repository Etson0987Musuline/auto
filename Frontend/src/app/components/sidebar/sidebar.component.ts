import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() activeNav = 'van';
  @Output() navChange = new EventEmitter<string>();

  selectNav(nav: string): void {
    this.activeNav = nav;
    this.navChange.emit(nav);
  }
}
