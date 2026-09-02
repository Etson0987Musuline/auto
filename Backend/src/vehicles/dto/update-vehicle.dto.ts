import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateVehicleDto {
  @IsString()
  @IsOptional()
  vehicleModel?: string;

  @IsString()
  @IsOptional()
  driverName?: string;

  @IsString()
  @IsOptional()
  driverIdCode?: string;

  @IsString()
  @IsOptional()
  marca?: string;

  @IsString()
  @IsOptional()
  modelo?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  payload?: string;

  @IsString()
  @IsOptional()
  loadVolume?: string;

  @IsString()
  @IsOptional()
  loadLength?: string;

  @IsString()
  @IsOptional()
  loadWidth?: string;

  @IsString()
  @IsOptional()
  licensePlate?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @IsOptional()
  vehicleImageUrl?: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
