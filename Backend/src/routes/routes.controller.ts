import { Controller, Get, Param } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { Route } from './route.entity';

@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Get()
  async findAll(): Promise<Route[]> {
    return this.routesService.findAll();
  }

  @Get('vehicle/:vehicleId')
  async findByVehicle(@Param('vehicleId') vehicleId: string): Promise<Route[]> {
    return this.routesService.findByVehicle(+vehicleId);
  }
}
