import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateDriverDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del conductor es obligatorio' })
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'El código de identificación es obligatorio' })
  codigo: string;

  @IsString()
  @IsOptional()
  fotoUrl?: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  estado?: string;

  @IsNumber()
  @IsOptional()
  vehiculoId?: number;
}
