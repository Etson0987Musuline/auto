import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Vehicle } from '../vehicles/vehicle.entity';
import { Driver } from '../drivers/driver.entity';

@Entity('routes')
export class Route {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  routeCode: string;

  @Column({ default: 0 })
  packageCount: number;

  @Column()
  origin: string;

  @Column()
  destination: string;

  @Column({ nullable: true })
  distance: string;

  @Column({ nullable: true })
  timeLeft: string;

  @Column({ nullable: true })
  weight: string;

  @Column({ nullable: true })
  volume: string;

  @Column({ default: 'EN CURSO' })
  status: string; // 'EN CURSO' | 'PENDIENTE' | 'COMPLETADO'

  @Column({ default: false })
  isNowOnWay: boolean;

  @Column({ nullable: true })
  dateLabel: string;

  @ManyToOne(() => Vehicle, (vehicle: Vehicle) => vehicle.routes, { onDelete: 'CASCADE', nullable: true })
  vehicle: Vehicle;

  @ManyToOne(() => Driver, (driver: Driver) => driver.rutas, { onDelete: 'CASCADE', nullable: true })
  driver: Driver;
}
