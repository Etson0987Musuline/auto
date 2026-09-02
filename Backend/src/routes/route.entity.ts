import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Vehicle } from '../vehicles/vehicle.entity';

@Entity('routes')
export class Route {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  routeCode: string;

  @Column()
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

  @Column({ default: false })
  isNowOnWay: boolean;

  @Column({ nullable: true })
  dateLabel: string;

  @ManyToOne(() => Vehicle, (vehicle: Vehicle) => vehicle.routes, { onDelete: 'CASCADE' })
  vehicle: Vehicle;
}
