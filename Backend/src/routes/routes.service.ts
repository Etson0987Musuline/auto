import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Route } from './route.entity';
import { Vehicle } from '../vehicles/vehicle.entity';
import { Driver } from '../drivers/driver.entity';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';

@Injectable()
export class RoutesService implements OnModuleInit {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
  ) {}

  async onModuleInit() {
    try {
      const count = await this.routeRepository.count();
      if (count === 0) {
        await this.seedRoutes();
      }
    } catch {
      // Ignored if DB not connected yet
    }
  }

  async findAll(): Promise<Route[]> {
    return this.routeRepository.find({
      relations: { vehicle: true, driver: true },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Route | null> {
    return this.routeRepository.findOne({
      where: { id },
      relations: { vehicle: true, driver: true },
    });
  }

  async findByVehicle(vehicleId: number): Promise<Route[]> {
    return this.routeRepository.find({
      where: { vehicle: { id: vehicleId } },
      relations: { vehicle: true, driver: true },
      order: { isNowOnWay: 'DESC', id: 'ASC' },
    });
  }

  async findByDriver(driverId: number): Promise<Route[]> {
    return this.routeRepository.find({
      where: { driver: { id: driverId } },
      relations: { vehicle: true, driver: true },
      order: { isNowOnWay: 'DESC', id: 'ASC' },
    });
  }

  async create(dto: CreateRouteDto): Promise<Route> {
    const route = this.routeRepository.create({
      routeCode: dto.routeCode,
      packageCount: dto.packageCount ?? 100,
      origin: dto.origin,
      destination: dto.destination,
      distance: dto.distance || '0.62 mi (1.0 km)',
      timeLeft: dto.timeLeft || '10 min',
      weight: dto.weight || '2,160 lbs (980 kg)',
      volume: dto.volume || '247 in³ (4.0 m³)',
      status: dto.status || 'EN CURSO',
      isNowOnWay: dto.isNowOnWay ?? true,
      dateLabel: dto.dateLabel || new Date().toLocaleDateString('es-PE'),
    });

    if (dto.vehicleId) {
      const vehicle = await this.vehicleRepository.findOneBy({ id: dto.vehicleId });
      if (vehicle) route.vehicle = vehicle;
    }

    if (dto.driverId) {
      const driver = await this.driverRepository.findOneBy({ id: dto.driverId });
      if (driver) route.driver = driver;
    }

    return this.routeRepository.save(route);
  }

  async update(id: number, dto: UpdateRouteDto): Promise<Route | null> {
    const route = await this.findOne(id);
    if (!route) return null;

    if (dto.vehicleId) {
      const vehicle = await this.vehicleRepository.findOneBy({ id: dto.vehicleId });
      if (vehicle) route.vehicle = vehicle;
    }
    if (dto.driverId) {
      const driver = await this.driverRepository.findOneBy({ id: dto.driverId });
      if (driver) route.driver = driver;
    }

    Object.assign(route, {
      ...(dto.routeCode && { routeCode: dto.routeCode }),
      ...(dto.packageCount !== undefined && { packageCount: dto.packageCount }),
      ...(dto.origin && { origin: dto.origin }),
      ...(dto.destination && { destination: dto.destination }),
      ...(dto.distance && { distance: dto.distance }),
      ...(dto.timeLeft && { timeLeft: dto.timeLeft }),
      ...(dto.weight && { weight: dto.weight }),
      ...(dto.volume && { volume: dto.volume }),
      ...(dto.status && { status: dto.status }),
      ...(dto.isNowOnWay !== undefined && { isNowOnWay: dto.isNowOnWay }),
      ...(dto.dateLabel && { dateLabel: dto.dateLabel }),
    });

    return this.routeRepository.save(route);
  }

  async remove(id: number): Promise<{ success: boolean; message: string }> {
    await this.routeRepository.delete(id);
    return { success: true, message: 'Ruta eliminada con éxito' };
  }

  private async seedRoutes() {
    const defaultRoutes: Partial<Route>[] = [
      {
        routeCode: '107-591',
        packageCount: 138,
        origin: 'Av. Javier Prado Este 2450, San Borja',
        destination: 'Calle Las Camelias 450, San Isidro',
        distance: '0.62 mi (1.0 km)',
        timeLeft: '10 min',
        weight: '2,160 lbs (980 kg)',
        volume: '247 in³ (4.0 m³)',
        status: 'EN CURSO',
        isNowOnWay: true,
      },
      {
        routeCode: '109-270',
        packageCount: 107,
        origin: 'Av. República de Panamá 3055',
        destination: 'Av. Benavides 1540, Miraflores',
        distance: '1.45 mi (2.3 km)',
        timeLeft: '22 min',
        weight: '1,890 lbs (857 kg)',
        volume: '190 in³ (3.1 m³)',
        dateLabel: '12/10/24',
        status: 'COMPLETADO',
        isNowOnWay: false,
      },
      {
        routeCode: '112-791',
        packageCount: 86,
        origin: 'Av. Paseo de la República 4200',
        destination: 'Av. Los Próceres 820, Surco',
        distance: '2.10 mi (3.4 km)',
        timeLeft: '35 min',
        weight: '1,240 lbs (562 kg)',
        volume: '145 in³ (2.4 m³)',
        dateLabel: '10/10/24',
        status: 'COMPLETADO',
        isNowOnWay: false,
      },
      {
        routeCode: '115-402',
        packageCount: 64,
        origin: 'Av. Elmer Faucett 120, Callao',
        destination: 'Av. La Marina 2100, San Miguel',
        distance: '3.80 mi (6.1 km)',
        timeLeft: '45 min',
        weight: '980 lbs (444 kg)',
        volume: '112 in³ (1.8 m³)',
        dateLabel: '08/10/24',
        status: 'COMPLETADO',
        isNowOnWay: false,
      },
    ];

    for (const r of defaultRoutes) {
      await this.routeRepository.save(this.routeRepository.create(r));
    }
  }
}
