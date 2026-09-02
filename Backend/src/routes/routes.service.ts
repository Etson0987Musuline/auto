import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Route } from './route.entity';

@Injectable()
export class RoutesService implements OnModuleInit {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
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
    return this.routeRepository.find({ relations: { vehicle: true } });
  }

  async findByVehicle(vehicleId: number): Promise<Route[]> {
    return this.routeRepository.find({
      where: { vehicle: { id: vehicleId } },
      relations: { vehicle: true },
    });
  }

  private async seedRoutes() {
    const defaultRoutes: Partial<Route>[] = [
      {
        routeCode: '107-591',
        packageCount: 138,
        origin: '2972 Westheimer Rd. Santa Ana',
        destination: '270 Rucker Ave',
        distance: '0.62 mi',
        timeLeft: '10 min',
        weight: '2,160 lbs',
        volume: '247 in³',
        isNowOnWay: true,
      },
      {
        routeCode: '109-270',
        packageCount: 107,
        origin: '8900 Murray Ave',
        destination: '168 W 10th St, Gilroy, CA 95020',
        dateLabel: '12/10/22',
        isNowOnWay: false,
      },
      {
        routeCode: '112-791',
        packageCount: 86,
        origin: '230 Mayock Rd',
        destination: '8225 Arroyo Cir Suite 21, Gilroy, CA 95020',
        isNowOnWay: false,
      },
      {
        routeCode: '128-612',
        packageCount: 129,
        origin: '6215 Engle Way',
        destination: '905 1st St, Gilroy, CA 95020',
        isNowOnWay: false,
      },
    ];

    for (const routeData of defaultRoutes) {
      await this.routeRepository.save(this.routeRepository.create(routeData));
    }
  }
}
