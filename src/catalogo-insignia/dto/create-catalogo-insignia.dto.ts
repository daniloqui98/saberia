import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateCatalogoInsigniaDto {
  // Código único, alfanumérico, sin espacios y de máximo 20 caracteres
  @IsString({ message: 'El código debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El código es obligatorio' })
  @MaxLength(20, { message: 'El código debe tener máximo 20 caracteres' })
  @Matches(/^\S+$/, { message: 'El código no debe contener espacios' })
  codigo: string;

  // Nombre de la insignia de máximo 100 caracteres
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(100, { message: 'El nombre debe tener máximo 100 caracteres' })
  nombre: string;

  // Descripción opcional de máximo 300 caracteres
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MaxLength(300, { message: 'La descripción debe tener máximo 300 caracteres' })
  @IsOptional()
  descripcion?: string;

  // Ruta o URL del icono de máximo 255 caracteres
  @IsString({ message: 'El icono debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El icono es obligatorio' })
  @MaxLength(255, { message: 'El icono debe tener máximo 255 caracteres' })
  icono: string;

  // Criterio técnico de máximo 100 caracteres
  @IsString({ message: 'El criterio debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El criterio es obligatorio' })
  @MaxLength(100, { message: 'El criterio debe tener máximo 100 caracteres' })
  criterio: string;

  // Puntos extra opcionales, enteros y mayores o iguales a 0 (por defecto 0)
  @IsInt({ message: 'Los puntos bonus deben ser un número entero' })
  @Min(0, { message: 'Los puntos bonus no pueden ser negativos' })
  @IsOptional()
  puntos_bonus?: number;
}
