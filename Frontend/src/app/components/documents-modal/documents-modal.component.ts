import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vehicle, VehicleDocument } from '../../models/fleet.model';

@Component({
  selector: 'app-documents-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './documents-modal.component.html',
  styleUrl: './documents-modal.component.scss'
})
export class DocumentsModalComponent {
  @Input() vehicle: Vehicle | null = null;
  @Output() closeModal = new EventEmitter<void>();

  documents: VehicleDocument[] = [
    {
      id: 'DOC-001',
      title: 'Póliza de Seguro SOAT Comercial',
      type: 'Seguro Obligatorio',
      expiration: '15/12/2026',
      status: 'VIGENTE',
      fileNumber: 'POL-883920-PE'
    },
    {
      id: 'DOC-002',
      title: 'Certificado de Inspección Técnica Vehicular (CITV)',
      type: 'Revisión Técnica',
      expiration: '20/10/2026',
      status: 'VIGENTE',
      fileNumber: 'CITV-554219'
    },
    {
      id: 'DOC-003',
      title: 'Tarjeta de Identificación Vehicular (TIV)',
      type: 'Propiedad y Registro',
      expiration: 'Indefinida',
      status: 'VIGENTE',
      fileNumber: 'TIV-SUNARP-9923'
    },
    {
      id: 'DOC-004',
      title: 'Licencia de Conducir Profesional (Categoría A-IIIb)',
      type: 'Habilitación de Conductor',
      expiration: '05/08/2027',
      status: 'VIGENTE',
      fileNumber: 'Q-45892102'
    },
    {
      id: 'DOC-005',
      title: 'Autorización MTC de Transporte Terrestre de Mercancías',
      type: 'Permiso de Carga',
      expiration: '30/11/2026',
      status: 'POR RENOVAR',
      fileNumber: 'MTC-RES-2024-890'
    }
  ];

  onClose(): void {
    this.closeModal.emit();
  }

  downloadDoc(doc: VehicleDocument): void {
    alert(`Descargando documento digital: ${doc.title} (${doc.fileNumber})`);
  }
}
