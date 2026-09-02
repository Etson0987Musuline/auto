import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Driver } from './driver.entity';

@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fecha: string;

  @Column()
  categoria: string; // 'EN CAMINO' | 'CARGANDO' | 'ESPERANDO' | 'DESCARGANDO'

  @Column('float')
  horasTrabajadas: number;

  @Column('float', { default: 8.5 })
  horasPromedio: number;

  @ManyToOne(() => Driver, (driver: Driver) => driver.logs, { onDelete: 'CASCADE' })
  conductor: Driver;
}
