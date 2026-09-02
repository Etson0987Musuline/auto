import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { Route } from './route.entity';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';

@Controller(['rutas', 'routes'])
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Get()
  async findAll(): Promise<Route[]> {
    return this.routesService.findAll();
  }

  @Get('vehiculo/:vehicleId')
  async findByVehiculo(@Param('vehicleId') vehicleId: string): Promise<Route[]> {
    return this.routesService.findByVehicle(+vehicleId);
  }

  @Get('vehicle/:vehicleId')
  async findByVehicle(@Param('vehicleId') vehicleId: string): Promise<Route[]> {
    return this.routesService.findByVehicle(+vehicleId);
  }

  @Get('conductor/:driverId')
  async findByDriver(@Param('driverId') driverId: string): Promise<Route[]> {
    return this.routesService.findByDriver(+driverId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Route | null> {
    return this.routesService.findOne(+id);
  }

  @Post()
  async create(@Body() dto: CreateRouteDto): Promise<Route> {
    return this.routesService.create(dto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateRouteDto,
  ): Promise<Route | null> {
    return this.routesService.update(+id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.routesService.remove(+id);
  }
}
