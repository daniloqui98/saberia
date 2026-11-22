import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateOpcionDto {
  // ID de la pregunta a la que pertenece (debe existir en tbl_pregunta)
  @IsInt({ message: 'El id_pregunta debe ser un número entero' })
  @Min(1, { message: 'El id_pregunta debe ser mayor que 0' })
  @IsNotEmpty({ message: 'El id_pregunta es obligatorio' })
  id_pregunta: number;

  // Texto de la opción de máximo 500 caracteres
  @IsString({ message: 'El texto debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El texto es obligatorio' })
  @MaxLength(500, { message: 'El texto debe tener máximo 500 caracteres' })
  texto: string;

  // Campo opcional, por defecto FALSE
  @IsBoolean({ message: 'es_correcta debe ser un valor booleano' })
  @IsOptional()
  es_correcta?: boolean;

  // Retroalimentación opcional de máximo 500 caracteres
  @IsString({ message: 'La retroalimentación debe ser una cadena de texto' })
  @MaxLength(500, {
    message: 'La retroalimentación debe tener máximo 500 caracteres',
  })
  @IsOptional()
  retroalimentacion?: string;

  // Posición opcional del 1 al 5 (por defecto 1)
  @IsInt({ message: 'El orden debe ser un número entero' })
  @Min(1, { message: 'El orden debe estar entre 1 y 5' })
  @Max(5, { message: 'El orden debe estar entre 1 y 5' })
  @IsOptional()
  orden?: number;
}
