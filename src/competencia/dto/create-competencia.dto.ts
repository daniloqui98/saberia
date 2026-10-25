import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateCompetenciaDto {
  // ID del módulo al que pertenece (debe existir en tbl_modulo)
  @IsInt({ message: 'El id_modulo debe ser un número entero' })
  @Min(1, { message: 'El id_modulo debe ser mayor que 0' })
  @IsNotEmpty({ message: 'El id_modulo es obligatorio' })
  id_modulo: number;

  // Código único, alfanumérico, sin espacios y de máximo 20 caracteres
  @IsString({ message: 'El código debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El código es obligatorio' })
  @MaxLength(20, { message: 'El código debe tener máximo 20 caracteres' })
  @Matches(/^\S+$/, { message: 'El código no debe contener espacios' })
  codigo: string;

  // Nombre de la competencia de máximo 200 caracteres
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(200, { message: 'El nombre debe tener máximo 200 caracteres' })
  nombre: string;

  // Descripción opcional de máximo 500 caracteres
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MaxLength(500, { message: 'La descripción debe tener máximo 500 caracteres' })
  @IsOptional()
  descripcion?: string;

  // Campo opcional, por defecto TRUE
  @IsBoolean({ message: 'activo debe ser un valor booleano' })
  @IsOptional()
  activo?: boolean;
}
