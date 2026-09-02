import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './vehicle.entity';

@Injectable()
export class VehiclesService implements OnModuleInit {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  async onModuleInit() {
    try {
      const count = await this.vehicleRepository.count();
      if (count === 0) {
        await this.seedInitialData();
      }
    } catch {
      // Ignored if DB is not connected yet
    }
  }

  async findAll(): Promise<Vehicle[]> {
    return this.vehicleRepository.find({ relations: { routes: true } });
  }

  async findOne(id: number): Promise<Vehicle | null> {
    return this.vehicleRepository.findOne({
      where: { id },
      relations: { routes: true },
    });
  }

  async create(vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    const vehicle = this.vehicleRepository.create(vehicleData);
    return this.vehicleRepository.save(vehicle);
  }

  async update(id: number, vehicleData: Partial<Vehicle>): Promise<Vehicle | null> {
    await this.vehicleRepository.update(id, vehicleData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ success: boolean }> {
    await this.vehicleRepository.delete(id);
    return { success: true };
  }

  async checkDbHealth(): Promise<{ connected: boolean; message: string }> {
    try {
      await this.vehicleRepository.query('SELECT 1');
      return { connected: true, message: 'PostgreSQL AngularDB Connected' };
    } catch (err: any) {
      return { connected: false, message: err?.message || 'Database Disconnected' };
    }
  }

  private async seedInitialData() {
    const initial: Partial<Vehicle>[] = [
      { driverName: 'Nolan Dokidis', driverIdCode: '236-542-001', vehicleModel: 'Mercedes-Benz Sprinter', status: 'ON THE WAY', category: 'FAVORITES' },
      { driverName: 'Ahmad Mango', driverIdCode: '236-542-002', vehicleModel: 'Volkswagen Transporter', status: 'LOADING', category: 'FAVORITES' },
      { driverName: 'James Lubin', driverIdCode: '236-542-097', vehicleModel: 'Volkswagen Transporter', status: 'ON THE WAY', category: 'FAVORITES', payload: '2,885 lbs', loadVolume: '0.55 in³', loadLength: '117 in', loadWidth: '67 in', licensePlate: '6TRJ244' },
      { driverName: 'Talan Dorwart', driverIdCode: '236-542-004', vehicleModel: 'Mercedes-Benz Metris', status: 'WAITING', category: 'FAVORITES' },
      { driverName: 'Jakob Vetrovs', driverIdCode: '236-542-005', vehicleModel: 'Volvo FL', status: 'ON THE WAY', category: 'TRUCKS' },
      { driverName: 'Zain Vetrovs', driverIdCode: '236-542-006', vehicleModel: 'Mercedes-Benz Atego', status: 'WAITING', category: 'TRUCKS' },
      { driverName: 'Gustavo Torff', driverIdCode: '236-542-007', vehicleModel: 'Volvo FH', status: 'UNLOADING', category: 'TRUCKS' },
      { driverName: 'Tiana Westervelt', driverIdCode: '236-542-008', vehicleModel: 'Volkswagen Transporter', status: 'LOADING', category: 'VANS' },
      { driverName: 'Zain Korsgaard', driverIdCode: '236-542-009', vehicleModel: 'Mercedes-Benz Sprinter', status: 'ON THE WAY', category: 'VANS' },
    ];
    for (const v of initial) {
      await this.vehicleRepository.save(this.vehicleRepository.create(v));
    }
  }
}
