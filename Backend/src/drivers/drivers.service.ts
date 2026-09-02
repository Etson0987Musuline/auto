import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from './driver.entity';
import { ActivityLog } from './activity-log.entity';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

export interface DriverStatsResponse {
  onTheWayPercent: number;
  onTheWayTime: string;
  unloadingPercent: number;
  unloadingTime: string;
  loadingPercent: number;
  loadingTime: string;
  waitingPercent: number;
  waitingTime: string;
  chartData: {
    label: string;
    workingHours: number;
    avgWorkingHours: number;
    timeText: string;
    avgText: string;
  }[];
}

@Injectable()
export class DriversService implements OnModuleInit {
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepo: Repository<Driver>,
    @InjectRepository(ActivityLog)
    private readonly activityRepo: Repository<ActivityLog>,
  ) {}

  async onModuleInit() {
    try {
      const count = await this.driverRepo.count();
      if (count === 0) {
        await this.seedDrivers();
      }
    } catch {
      // Ignored if DB is disconnected
    }
  }

  async findAll(): Promise<Driver[]> {
    return this.driverRepo.find({
      relations: { vehiculo: true, rutas: true, logs: true },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Driver | null> {
    return this.driverRepo.findOne({
      where: { id },
      relations: { vehiculo: true, rutas: true, logs: true },
    });
  }

  async create(dto: CreateDriverDto): Promise<Driver> {
    const driver = this.driverRepo.create(dto);
    return this.driverRepo.save(driver);
  }

  async update(id: number, dto: UpdateDriverDto): Promise<Driver | null> {
    await this.driverRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ success: boolean; message: string }> {
    await this.driverRepo.delete(id);
    return { success: true, message: 'Conductor eliminado correctamente' };
  }

  async getStatistics(driverId?: number): Promise<DriverStatsResponse> {
    // Si se pasa driverId, podemos buscar sus logs reales o devolver la consolidación
    let logs: ActivityLog[] = [];
    if (driverId) {
      logs = await this.activityRepo.find({
        where: { conductor: { id: driverId } },
        order: { id: 'ASC' },
      });
    }

    if (logs.length > 0) {
      const totalHours = logs.reduce((acc, l) => acc + l.horasTrabajadas, 0) || 1;
      const onTheWay = logs.filter(l => l.categoria === 'EN CAMINO').reduce((a, b) => a + b.horasTrabajadas, 0);
      const unloading = logs.filter(l => l.categoria === 'DESCARGANDO').reduce((a, b) => a + b.horasTrabajadas, 0);
      const loading = logs.filter(l => l.categoria === 'CARGANDO').reduce((a, b) => a + b.horasTrabajadas, 0);
      const waiting = logs.filter(l => l.categoria === 'ESPERANDO').reduce((a, b) => a + b.horasTrabajadas, 0);

      const toHrsMins = (hrs: number) => {
        const h = Math.floor(hrs);
        const m = Math.round((hrs - h) * 60);
        return `${h} hr ${m} min`;
      };

      return {
        onTheWayPercent: Math.round((onTheWay / totalHours) * 1000) / 10 || 39.7,
        onTheWayTime: toHrsMins(onTheWay) || '3 hr 10 min',
        unloadingPercent: Math.round((unloading / totalHours) * 1000) / 10 || 28.3,
        unloadingTime: toHrsMins(unloading) || '2 hr 15 min',
        loadingPercent: Math.round((loading / totalHours) * 1000) / 10 || 17.4,
        loadingTime: toHrsMins(loading) || '1 hr 23 min',
        waitingPercent: Math.round((waiting / totalHours) * 1000) / 10 || 14.6,
        waitingTime: toHrsMins(waiting) || '1 hr 10 min',
        chartData: logs.map(l => ({
          label: l.fecha,
          workingHours: l.horasTrabajadas,
          avgWorkingHours: l.horasPromedio,
          timeText: toHrsMins(l.horasTrabajadas),
          avgText: toHrsMins(l.horasPromedio),
        })),
      };
    }

    // Default consolidated metrics
    return {
      onTheWayPercent: 39.7,
      onTheWayTime: '3 hr 10 min',
      unloadingPercent: 28.3,
      unloadingTime: '2 hr 15 min',
      loadingPercent: 17.4,
      loadingTime: '1 hr 23 min',
      waitingPercent: 14.6,
      waitingTime: '1 hr 10 min',
      chartData: [
        { label: '09/10', workingHours: 7.2, avgWorkingHours: 8.5, timeText: '7 hr 12 min', avgText: '8 hr 30 min' },
        { label: '10/10', workingHours: 5.4, avgWorkingHours: 8.5, timeText: '5 hr 24 min', avgText: '8 hr 30 min' },
        { label: '11/10', workingHours: 6.53, avgWorkingHours: 8.5, timeText: '6 hr 32 min', avgText: '8 hr 30 min' },
        { label: '12/10', workingHours: 8.1, avgWorkingHours: 8.5, timeText: '8 hr 06 min', avgText: '8 hr 30 min' },
        { label: '13/10', workingHours: 4.8, avgWorkingHours: 8.5, timeText: '4 hr 48 min', avgText: '8 hr 30 min' },
        { label: '14/10', workingHours: 7.9, avgWorkingHours: 8.5, timeText: '7 hr 54 min', avgText: '8 hr 30 min' },
        { label: '15/10', workingHours: 6.8, avgWorkingHours: 8.5, timeText: '6 hr 48 min', avgText: '8 hr 30 min' },
      ],
    };
  }

  private async seedDrivers() {
    const driversData = [
      {
        nombre: 'James Lubin',
        codigo: '236-542-097',
        fotoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        telefono: '+51 987 654 321',
        email: 'james.lubin@fleetpro.pe',
        estado: 'EN CAMINO',
      },
      {
        nombre: 'Nolan Dokidis',
        codigo: '236-542-001',
        fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        telefono: '+51 982 112 334',
        email: 'nolan.dokidis@fleetpro.pe',
        estado: 'EN CAMINO',
      },
      {
        nombre: 'Ahmad Mango',
        codigo: '236-542-002',
        fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
        telefono: '+51 984 556 778',
        email: 'ahmad.mango@fleetpro.pe',
        estado: 'CARGANDO',
      },
      {
        nombre: 'Talan Dorwart',
        codigo: '236-542-004',
        fotoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
        telefono: '+51 989 334 221',
        email: 'talan.dorwart@fleetpro.pe',
        estado: 'ESPERANDO',
      },
      {
        nombre: 'Jakob Vetrovs',
        codigo: '236-542-005',
        fotoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
        telefono: '+51 991 445 667',
        email: 'jakob.vetrovs@fleetpro.pe',
        estado: 'EN CAMINO',
      },
      {
        nombre: 'Gustavo Torff',
        codigo: '236-542-007',
        fotoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
        telefono: '+51 993 778 990',
        email: 'gustavo.torff@fleetpro.pe',
        estado: 'DESCARGANDO',
      },
    ];

    for (const d of driversData) {
      const savedDriver = await this.driverRepo.save(this.driverRepo.create(d));
      
      // Sembrar logs de actividad para el conductor
      const logs = [
        { fecha: '09/10', categoria: 'EN CAMINO', horasTrabajadas: 3.1, horasPromedio: 8.5, conductor: savedDriver },
        { fecha: '09/10', categoria: 'DESCARGANDO', horasTrabajadas: 2.2, horasPromedio: 8.5, conductor: savedDriver },
        { fecha: '09/10', categoria: 'CARGANDO', horasTrabajadas: 1.4, horasPromedio: 8.5, conductor: savedDriver },
        { fecha: '09/10', categoria: 'ESPERANDO', horasTrabajadas: 1.1, horasPromedio: 8.5, conductor: savedDriver },
      ];
      for (const log of logs) {
        await this.activityRepo.save(this.activityRepo.create(log));
      }
    }
  }
}
