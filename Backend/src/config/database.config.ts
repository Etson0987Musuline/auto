import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Vehicle } from '../vehicles/vehicle.entity';
import { Route } from '../routes/route.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'Admin123',
  database: process.env.DB_NAME || 'AngularDB',
  entities: [Vehicle, Route],
  synchronize: true,
  retryAttempts: 3,
  retryDelay: 1000,
};
