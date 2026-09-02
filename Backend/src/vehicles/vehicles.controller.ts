import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { Vehicle } from './vehicle.entity';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  async findAll(): Promise<Vehicle[]> {
    return this.vehiclesService.findAll();
  }

  @Get('health/db')
  async checkDbHealth() {
    return this.vehiclesService.checkDbHealth();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Vehicle | null> {
    return this.vehiclesService.findOne(+id);
  }

  @Post()
  async create(@Body() vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    return this.vehiclesService.create(vehicleData);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() vehicleData: Partial<Vehicle>,
  ): Promise<Vehicle | null> {
    return this.vehiclesService.update(+id, vehicleData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.vehiclesService.remove(+id);
  }
}
