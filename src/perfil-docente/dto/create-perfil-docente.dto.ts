import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreatePerfilDocenteDto {
  // ID del usuario base (debe existir y tener el rol DOCENTE)
  @IsInt({ message: 'El id_usuario debe ser un número entero' })
  @Min(1, { message: 'El id_usuario debe ser mayor que 0' })
  @IsNotEmpty({ message: 'El id_usuario es obligatorio' })
  id_usuario: number;

  // Área de conocimiento de máximo 100 caracteres
  @IsString({ message: 'El área debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El área es obligatoria' })
  @MaxLength(100, { message: 'El área debe tener máximo 100 caracteres' })
  area: string;

  // Tipo de vinculación con la universidad
  @IsIn(['Planta', 'Catedratico', 'Ocasional'], {
    message: 'La vinculación debe ser Planta, Catedratico u Ocasional',
  })
  @IsNotEmpty({ message: 'La vinculación es obligatoria' })
  vinculacion: string;
}
