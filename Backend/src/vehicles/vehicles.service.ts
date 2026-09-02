import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { Driver } from '../drivers/driver.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService implements OnModuleInit {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
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
    return this.vehicleRepository.find({
      relations: { routes: true, conductor: true },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Vehicle | null> {
    return this.vehicleRepository.findOne({
      where: { id },
      relations: { routes: true, conductor: true },
    });
  }

  async create(dto: CreateVehicleDto): Promise<Vehicle> {
    const vehicle = this.vehicleRepository.create({
      ...dto,
      driverName: dto.driverName || 'Nuevo Conductor',
      driverIdCode: dto.driverIdCode || `236-542-${Math.floor(100 + Math.random() * 900)}`,
      category: dto.category || 'FURGONETAS',
      status: dto.status || 'EN CAMINO',
      payload: dto.payload || '2,885 lbs (1,308 kg)',
      loadVolume: dto.loadVolume || '0.55 in³ (5.8 m³)',
      loadLength: dto.loadLength || '117 in (2.97 m)',
      loadWidth: dto.loadWidth || '67 in (1.70 m)',
      licensePlate: dto.licensePlate || '6TRJ244',
      avatarUrl: dto.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      vehicleImageUrl: dto.vehicleImageUrl || 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?w=600&auto=format&fit=crop&q=80',
      activo: dto.activo ?? true,
    });
    return this.vehicleRepository.save(vehicle);
  }

  async update(id: number, dto: UpdateVehicleDto): Promise<Vehicle | null> {
    await this.vehicleRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ success: boolean; message: string }> {
    await this.vehicleRepository.delete(id);
    return { success: true, message: 'Vehículo eliminado correctamente de la base de datos' };
  }

  async checkDbHealth(): Promise<{ connected: boolean; message: string }> {
    try {
      await this.vehicleRepository.query('SELECT 1');
      return { connected: true, message: 'PostgreSQL AngularDB Conectado y Sincronizado' };
    } catch (err: any) {
      return { connected: false, message: err?.message || 'Servidor Offline o DB Desconectada' };
    }
  }

  private async seedInitialData() {
    const initialVehicles: Partial<Vehicle>[] = [
      {
        driverName: 'James Lubin',
        driverIdCode: '236-542-097',
        marca: 'Volkswagen',
        modelo: 'Transporter T6',
        vehicleModel: 'Volkswagen Transporter',
        status: 'EN CAMINO',
        category: 'FAVORITOS',
        payload: '2,885 lbs (1,308 kg)',
        loadVolume: '0.55 in³ (5.8 m³)',
        loadLength: '117 in (2.97 m)',
        loadWidth: '67 in (1.70 m)',
        licensePlate: '6TRJ244',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        vehicleImageUrl: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?w=600&auto=format&fit=crop&q=80',
        activo: true,
      },
      {
        driverName: 'Nolan Dokidis',
        driverIdCode: '236-542-001',
        marca: 'Mercedes-Benz',
        modelo: 'Sprinter 314',
        vehicleModel: 'Mercedes-Benz Sprinter',
        status: 'EN CAMINO',
        category: 'FAVORITOS',
        payload: '3,150 lbs (1,428 kg)',
        loadVolume: '0.62 in³ (6.5 m³)',
        loadLength: '130 in (3.30 m)',
        loadWidth: '70 in (1.78 m)',
        licensePlate: '8XPT102',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        vehicleImageUrl: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?w=600&auto=format&fit=crop&q=80',
        activo: true,
      },
      {
        driverName: 'Ahmad Mango',
        driverIdCode: '236-542-002',
        marca: 'Volkswagen',
        modelo: 'Transporter Cargo',
        vehicleModel: 'Volkswagen Transporter',
        status: 'CARGANDO',
        category: 'FAVORITOS',
        payload: '2,750 lbs (1,247 kg)',
        loadVolume: '0.52 in³ (5.5 m³)',
        loadLength: '115 in (2.92 m)',
        loadWidth: '66 in (1.68 m)',
        licensePlate: '4KLA918',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
        vehicleImageUrl: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?w=600&auto=format&fit=crop&q=80',
        activo: true,
      },
      {
        driverName: 'Talan Dorwart',
        driverIdCode: '236-542-004',
        marca: 'Mercedes-Benz',
        modelo: 'Metris Van',
        vehicleModel: 'Mercedes-Benz Metris',
        status: 'ESPERANDO',
        category: 'FAVORITOS',
        payload: '2,500 lbs (1,134 kg)',
        loadVolume: '0.48 in³ (5.1 m³)',
        loadLength: '110 in (2.79 m)',
        loadWidth: '65 in (1.65 m)',
        licensePlate: '7MNB331',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
        vehicleImageUrl: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?w=600&auto=format&fit=crop&q=80',
        activo: true,
      },
      {
        driverName: 'Jakob Vetrovs',
        driverIdCode: '236-542-005',
        marca: 'Volvo',
        modelo: 'FL 250 Heavy',
        vehicleModel: 'Volvo FL',
        status: 'EN CAMINO',
        category: 'CAMIONES',
        payload: '18,500 lbs (8,391 kg)',
        loadVolume: '1.45 in³ (15.2 m³)',
        loadLength: '240 in (6.10 m)',
        loadWidth: '96 in (2.44 m)',
        licensePlate: '9VLV502',
        avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
        vehicleImageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=80',
        activo: true,
      },
      {
        driverName: 'Zain Vetrovs',
        driverIdCode: '236-542-006',
        marca: 'Mercedes-Benz',
        modelo: 'Atego 1224',
        vehicleModel: 'Mercedes-Benz Atego',
        status: 'ESPERANDO',
        category: 'CAMIONES',
        payload: '14,200 lbs (6,441 kg)',
        loadVolume: '1.20 in³ (12.6 m³)',
        loadLength: '210 in (5.33 m)',
        loadWidth: '92 in (2.34 m)',
        licensePlate: '3ATG882',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
        vehicleImageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=80',
        activo: true,
      },
      {
        driverName: 'Gustavo Torff',
        driverIdCode: '236-542-007',
        marca: 'Volvo',
        modelo: 'FH 460 Globetrotter',
        vehicleModel: 'Volvo FH',
        status: 'DESCARGANDO',
        category: 'CAMIONES',
        payload: '44,000 lbs (19,958 kg)',
        loadVolume: '2.80 in³ (29.4 m³)',
        loadLength: '480 in (12.19 m)',
        loadWidth: '102 in (2.59 m)',
        licensePlate: '1VFH993',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
        vehicleImageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=80',
        activo: true,
      },
      {
        driverName: 'Tiana Westervelt',
        driverIdCode: '236-542-008',
        marca: 'Volkswagen',
        modelo: 'Transporter T6 Plus',
        vehicleModel: 'Volkswagen Transporter',
        status: 'CARGANDO',
        category: 'FURGONETAS',
        payload: '2,900 lbs (1,315 kg)',
        loadVolume: '0.56 in³ (5.9 m³)',
        loadLength: '118 in (3.00 m)',
        loadWidth: '67 in (1.70 m)',
        licensePlate: '5VWT108',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
        vehicleImageUrl: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?w=600&auto=format&fit=crop&q=80',
        activo: true,
      },
      {
        driverName: 'Zain Korsgaard',
        driverIdCode: '236-542-009',
        marca: 'Mercedes-Benz',
        modelo: 'Sprinter 316 CDI',
        vehicleModel: 'Mercedes-Benz Sprinter',
        status: 'EN CAMINO',
        category: 'FURGONETAS',
        payload: '3,200 lbs (1,451 kg)',
        loadVolume: '0.64 in³ (6.7 m³)',
        loadLength: '132 in (3.35 m)',
        loadWidth: '71 in (1.80 m)',
        licensePlate: '2MBS774',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
        vehicleImageUrl: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?w=600&auto=format&fit=crop&q=80',
        activo: true,
      },
    ];

    for (const v of initialVehicles) {
      await this.vehicleRepository.save(this.vehicleRepository.create(v));
    }
  }
}
