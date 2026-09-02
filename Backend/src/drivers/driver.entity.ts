import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Vehicle } from '../vehicles/vehicle.entity';
import { Route } from '../routes/route.entity';
import { ActivityLog } from './activity-log.entity';

@Entity('drivers')
export class Driver {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ unique: true })
  codigo: string;

  @Column({ nullable: true })
  fotoUrl: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({ nullable: true })
  email: string;

  @Column({ default: 'EN CAMINO' })
  estado: string; // 'EN CAMINO' | 'CARGANDO' | 'ESPERANDO' | 'DESCARGANDO'

  @OneToOne(() => Vehicle, (vehicle: Vehicle) => vehicle.conductor, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn()
  vehiculo: Vehicle;

  @OneToMany(() => Route, (route: Route) => route.driver)
  rutas: Route[];

  @OneToMany(() => ActivityLog, (log: ActivityLog) => log.conductor)
  logs: ActivityLog[];
}
