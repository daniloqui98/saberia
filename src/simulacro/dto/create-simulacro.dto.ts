import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

// total_preguntas y fecha_creacion no se envían: el sistema las maneja solo
export class CreateSimulacroDto {
  // ID del creador opcional: si no se envía, es el usuario que hace la petición
  @IsInt({ message: 'El id_creador debe ser un número entero' })
  @Min(1, { message: 'El id_creador debe ser mayor que 0' })
  @IsOptional()
  id_creador?: number;

  // ID del módulo opcional (NULL para simulacros mixtos)
  @IsInt({ message: 'El id_modulo debe ser un número entero' })
  @Min(1, { message: 'El id_modulo debe ser mayor que 0' })
  @IsOptional()
  id_modulo?: number | null;

  // Nombre con más de 3 caracteres y máximo 150
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(4, { message: 'El nombre debe tener más de 3 caracteres' })
  @MaxLength(150, { message: 'El nombre debe tener máximo 150 caracteres' })
  nombre: string;

  // Descripción opcional de máximo 500 caracteres
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MaxLength(500, { message: 'La descripción debe tener máximo 500 caracteres' })
  @IsOptional()
  descripcion?: string;

  // Tipo opcional, por defecto 'Entrenamiento'
  @IsIn(['Diagnostico', 'Entrenamiento', 'Final'], {
    message: 'El tipo debe ser Diagnostico, Entrenamiento o Final',
  })
  @IsOptional()
  tipo?: string;

  // Duración opcional entre 10 y 300 minutos (por defecto 60)
  @IsInt({ message: 'La duración debe ser un número entero de minutos' })
  @Min(10, { message: 'La duración debe estar entre 10 y 300 minutos' })
  @Max(300, { message: 'La duración debe estar entre 10 y 300 minutos' })
  @IsOptional()
  duracion_min?: number;

  // Visibilidad opcional, por defecto 'Privado'
  @IsIn(['Publico', 'Privado', 'Protegido'], {
    message: 'La visibilidad debe ser Publico, Privado o Protegido',
  })
  @IsOptional()
  visibilidad?: string;

  // Campo opcional, por defecto TRUE
  @IsBoolean({ message: 'estado debe ser un valor booleano' })
  @IsOptional()
  estado?: boolean;
}
