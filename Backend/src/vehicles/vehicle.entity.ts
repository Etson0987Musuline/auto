import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { Route } from '../routes/route.entity';
import { Driver } from '../drivers/driver.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  driverName: string;

  @Column({ nullable: true })
  driverIdCode: string;

  @Column({ nullable: true })
  marca: string;

  @Column({ nullable: true })
  modelo: string;

  @Column()
  vehicleModel: string;

  @Column({ default: 'EN CAMINO' })
  status: string; // 'EN CAMINO' | 'CARGANDO' | 'ESPERANDO' | 'DESCARGANDO' | 'ON THE WAY' ...

  @Column({ default: 'FAVORITOS' })
  category: string; // 'FAVORITOS' | 'CAMIONES' | 'FURGONETAS' | 'FAVORITES' | 'TRUCKS' | 'VANS'

  @Column({ nullable: true })
  payload: string; // Capacidad de carga ej. '2,885 lbs'

  @Column({ nullable: true })
  loadVolume: string; // Volumen ej. '0.55 in³'

  @Column({ nullable: true })
  loadLength: string; // ej. '117 in'

  @Column({ nullable: true })
  loadWidth: string; // ej. '67 in'

  @Column({ nullable: true })
  licensePlate: string; // Placa ej. '6TRJ244'

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true })
  vehicleImageUrl: string;

  @Column({ default: true })
  activo: boolean;

  @OneToOne(() => Driver, (driver: Driver) => driver.vehiculo, { nullable: true })
  conductor: Driver;

  @OneToMany(() => Route, (route: Route) => route.vehicle)
  routes: Route[];
}
