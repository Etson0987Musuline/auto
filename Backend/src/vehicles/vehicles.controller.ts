import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { Vehicle } from './vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Controller(['vehiculos', 'vehicles'])
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

  @Get('salud/db')
  async checkDbSalud() {
    return this.vehiclesService.checkDbHealth();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Vehicle | null> {
    return this.vehiclesService.findOne(+id);
  }

  @Post()
  async create(@Body() dto: CreateVehicleDto): Promise<Vehicle> {
    return this.vehiclesService.create(dto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateVehicleDto,
  ): Promise<Vehicle | null> {
    return this.vehiclesService.update(+id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.vehiclesService.remove(+id);
  }
}
