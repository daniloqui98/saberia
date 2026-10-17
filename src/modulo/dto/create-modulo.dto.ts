import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateModuloDto {
  // Código único, alfanumérico, sin espacios y de máximo 20 caracteres
  @IsString({ message: 'El código debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El código es obligatorio' })
  @MaxLength(20, { message: 'El código debe tener máximo 20 caracteres' })
  @Matches(/^\S+$/, { message: 'El código no debe contener espacios' })
  codigo: string;

  // Nombre del módulo con más de 5 caracteres y máximo 150
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(6, { message: 'El nombre debe tener más de 5 caracteres' })
  @MaxLength(150, { message: 'El nombre debe tener máximo 150 caracteres' })
  nombre: string;

  // Descripción opcional de máximo 500 caracteres
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MaxLength(500, { message: 'La descripción debe tener máximo 500 caracteres' })
  @IsOptional()
  descripcion?: string;

  // Tipo opcional, por defecto 'Generico'
  @IsIn(['Generico', 'Especifico'], {
    message: 'El tipo debe ser Generico o Especifico',
  })
  @IsOptional()
  tipo?: string;

  // Campo opcional, por defecto TRUE
  @IsBoolean({ message: 'activo debe ser un valor booleano' })
  @IsOptional()
  activo?: boolean;
}
