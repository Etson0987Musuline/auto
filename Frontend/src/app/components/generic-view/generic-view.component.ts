import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-generic-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generic-view.component.html',
  styleUrl: './generic-view.component.scss'
})
export class GenericViewComponent {
  @Input() title = 'Dashboard Section';
  @Input() description = 'Manage section settings and information.';
  @Input() icon = '📊';
}
