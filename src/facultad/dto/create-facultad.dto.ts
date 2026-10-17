import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateFacultadDto {
  // Código único, alfanumérico, sin espacios y de máximo 10 caracteres
  @IsString({ message: 'El código debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El código es obligatorio' })
  @MaxLength(10, { message: 'El código debe tener máximo 10 caracteres' })
  @Matches(/^\S+$/, { message: 'El código no debe contener espacios' })
  codigo: string;

  // Nombre de la facultad con más de 3 caracteres y máximo 100
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(4, { message: 'El nombre debe tener más de 3 caracteres' })
  @MaxLength(100, { message: 'El nombre debe tener máximo 100 caracteres' })
  nombre: string;
}
