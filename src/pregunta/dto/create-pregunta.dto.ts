import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

// version y fecha_creacion no se envían: el sistema las maneja solo
export class CreatePreguntaDto {
  // ID de la evidencia que mide (debe existir en tbl_evidencia)
  @IsInt({ message: 'El id_evidencia debe ser un número entero' })
  @Min(1, { message: 'El id_evidencia debe ser mayor que 0' })
  @IsNotEmpty({ message: 'El id_evidencia es obligatorio' })
  id_evidencia: number;

  // ID del autor opcional (usuario con rol DOCENTE o ADMINISTRADOR)
  @IsInt({ message: 'El id_autor debe ser un número entero' })
  @Min(1, { message: 'El id_autor debe ser mayor que 0' })
  @IsOptional()
  id_autor?: number | null;

  // Formulación de la pregunta
  @IsString({ message: 'El enunciado debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El enunciado es obligatorio' })
  enunciado: string;

  // Lectura o situación base opcional
  @IsString({ message: 'El contexto debe ser una cadena de texto' })
  @IsOptional()
  contexto?: string;

  // Tipo opcional, por defecto 'Seleccion multiple'
  @IsIn(['Seleccion multiple', 'Abierta'], {
    message: 'El tipo debe ser Seleccion multiple o Abierta',
  })
  @IsOptional()
  tipo?: string;

  // Dificultad opcional entre 0.00 y 5.00, máximo 2 decimales (por defecto 1.00)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'La dificultad debe ser un número con máximo 2 decimales' },
  )
  @Min(0, { message: 'La dificultad debe estar entre 0 y 5' })
  @Max(5, { message: 'La dificultad debe estar entre 0 y 5' })
  @IsOptional()
  dificultad?: number;

  // Puntaje opcional, entero >= 0 (por defecto 1)
  @IsInt({ message: 'El puntaje debe ser un número entero' })
  @Min(0, { message: 'El puntaje no puede ser negativo' })
  @IsOptional()
  puntaje?: number;

  // Justificación opcional de la respuesta correcta
  @IsString({ message: 'La justificación debe ser una cadena de texto' })
  @IsOptional()
  justificacion?: string;

  // Origen opcional de máximo 50 caracteres (por defecto 'Propia')
  @IsString({ message: 'El origen debe ser una cadena de texto' })
  @MaxLength(50, { message: 'El origen debe tener máximo 50 caracteres' })
  @IsOptional()
  origen?: string;

  // Campo opcional, por defecto TRUE
  @IsBoolean({ message: 'activa debe ser un valor booleano' })
  @IsOptional()
  activa?: boolean;
}
