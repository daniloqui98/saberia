import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateCatalogoRecompensaDto {
  // Nombre del premio de máximo 100 caracteres
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(100, { message: 'El nombre debe tener máximo 100 caracteres' })
  nombre: string;

  // Descripción opcional de máximo 255 caracteres
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MaxLength(255, { message: 'La descripción debe tener máximo 255 caracteres' })
  @IsOptional()
  descripcion?: string;

  // Costo opcional, entero y mayor que 0 (por defecto 100)
  @IsInt({ message: 'El costo en puntos debe ser un número entero' })
  @Min(1, { message: 'El costo en puntos debe ser mayor que 0' })
  @IsOptional()
  costo_puntos?: number;

  // Stock opcional, entero y mayor o igual a 0 (por defecto 0)
  @IsInt({ message: 'El stock debe ser un número entero' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  @IsOptional()
  stock?: number;

  // Campo opcional, por defecto TRUE
  @IsBoolean({ message: 'activo debe ser un valor booleano' })
  @IsOptional()
  activo?: boolean;
}
