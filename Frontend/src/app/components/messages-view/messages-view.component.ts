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
    { id: 1, sender: 'James Lubin', time: '10:42 AM', preview: 'Paquete #138 entregado exitosamente en Calle Las Camelias 450.', unread: true },
    { id: 2, sender: 'Ahmad Mango', time: '09:15 AM', preview: 'Carga completada en el Almacén 4. Saliendo hacia ruta asignada.', unread: false },
    { id: 3, sender: 'Gustavo Torff', time: 'Ayer', preview: 'Descarga con retraso de 15 minutos debido al tráfico en el muelle de carga.', unread: false },
    { id: 4, sender: 'Talan Dorwart', time: 'Ayer', preview: 'Esperando autorización de despacho para la unidad Mercedes-Benz Metris.', unread: false }
  ];

  selectedMessage = this.messages[0];

  selectMessage(msg: any): void {
    this.selectedMessage = msg;
    msg.unread = false;
  }
}
