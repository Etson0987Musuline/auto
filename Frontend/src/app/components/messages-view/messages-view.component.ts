import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-messages-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './messages-view.component.html',
  styleUrl: './messages-view.component.scss'
})
export class MessagesViewComponent {
  messages = [
    { id: 1, sender: 'James Lubin', time: '10:42 AM', preview: 'Package #138 delivered to 270 Rucker Ave successfully.', unread: true },
    { id: 2, sender: 'Ahmad Mango', time: '09:15 AM', preview: 'Loading completed at warehouse 4. Heading to route.', unread: false },
    { id: 3, sender: 'Gustavo Torff', time: 'Yesterday', preview: 'Unloading delayed by 15 mins due to dock traffic.', unread: false },
    { id: 4, sender: 'Talan Dorwart', time: 'Yesterday', preview: 'Waiting for dispatch approval for Mercedes-Benz Metris.', unread: false }
  ];

  selectedMessage = this.messages[0];

  selectMessage(msg: any): void {
    this.selectedMessage = msg;
    msg.unread = false;
  }
}
