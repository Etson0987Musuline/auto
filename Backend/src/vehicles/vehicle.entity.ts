import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Route } from '../routes/route.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  driverName: string;

  @Column()
  driverIdCode: string;

  @Column()
  vehicleModel: string;

  @Column({ default: 'ON THE WAY' })
  status: string;

  @Column({ default: 'FAVORITES' })
  category: string;

  @Column({ nullable: true })
  payload: string;

  @Column({ nullable: true })
  loadVolume: string;

  @Column({ nullable: true })
  loadLength: string;

  @Column({ nullable: true })
  loadWidth: string;

  @Column({ nullable: true })
  licensePlate: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true })
  vehicleImageUrl: string;

  @OneToMany(() => Route, (route: Route) => route.vehicle)
  routes: Route[];
}
