import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateRouteDto {
  @IsString()
  @IsNotEmpty({ message: 'El código de la ruta es obligatorio' })
  routeCode: string;

  @IsNumber()
  @IsOptional()
  packageCount?: number;

  @IsString()
  @IsNotEmpty({ message: 'El origen es obligatorio' })
  origin: string;

  @IsString()
  @IsNotEmpty({ message: 'El destino es obligatorio' })
  destination: string;

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
