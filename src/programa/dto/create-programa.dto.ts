import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProgramaDto {
  // ID de la facultad a la que pertenece (debe existir en tbl_facultad)
  @IsInt({ message: 'El id_facultad debe ser un número entero' })
  @Min(1, { message: 'El id_facultad debe ser mayor que 0' })
  @IsNotEmpty({ message: 'El id_facultad es obligatorio' })
  id_facultad: number;

  // Código único, alfanumérico, sin espacios y de máximo 15 caracteres
  @IsString({ message: 'El código debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El código es obligatorio' })
  @MaxLength(15, { message: 'El código debe tener máximo 15 caracteres' })
  @Matches(/^\S+$/, { message: 'El código no debe contener espacios' })
  codigo: string;

  // Nombre del programa de máximo 150 caracteres
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(150, { message: 'El nombre debe tener máximo 150 caracteres' })
  nombre: string;

  // Nivel opcional, por defecto 'Pregrado'
  @IsIn(['Pregrado', 'Posgrado', 'Diplomado'], {
    message: 'El nivel debe ser Pregrado, Posgrado o Diplomado',
  })
  @IsOptional()
  nivel?: string;
}
