import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateRolDto {
  // Nombre único del rol, sin espacios y de máximo 50 caracteres
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(50, { message: 'El nombre debe tener máximo 50 caracteres' })
  @Matches(/^\S+$/, { message: 'El nombre no debe contener espacios' })
  nombre: string;

  // Descripción opcional de máximo 150 caracteres
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MaxLength(150, { message: 'La descripción debe tener máximo 150 caracteres' })
  @IsOptional()
  descripcion?: string;
}
