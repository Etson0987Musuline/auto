import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class UpdateRouteDto {
  @IsString()
  @IsOptional()
  routeCode?: string;

  @IsNumber()
  @IsOptional()
  packageCount?: number;

  @IsString()
  @IsOptional()
  origin?: string;

  @IsString()
  @IsOptional()
  destination?: string;

  @IsString()
  @IsOptional()
  distance?: string;

  @IsString()
  @IsOptional()
  timeLeft?: string;

  @IsString()
  @IsOptional()
  weight?: string;

  @IsString()
  @IsOptional()
  volume?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsBoolean()
  @IsOptional()
  isNowOnWay?: boolean;

  @IsString()
  @IsOptional()
  dateLabel?: string;

  @IsNumber()
  @IsOptional()
  vehicleId?: number;

  @IsNumber()
  @IsOptional()
  driverId?: number;
}
