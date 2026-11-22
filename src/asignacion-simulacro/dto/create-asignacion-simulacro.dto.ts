import {
  IsBoolean,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateAsignacionSimulacroDto {
  // ID del grupo (debe existir y estar habilitado)
  @IsInt({ message: 'El id_grupo debe ser un número entero' })
  @Min(1, { message: 'El id_grupo debe ser mayor que 0' })
  @IsNotEmpty({ message: 'El id_grupo es obligatorio' })
  id_grupo: number;

  // ID del simulacro (debe existir, estar habilitado y tener preguntas)
  @IsInt({ message: 'El id_simulacro debe ser un número entero' })
  @Min(1, { message: 'El id_simulacro debe ser mayor que 0' })
  @IsNotEmpty({ message: 'El id_simulacro es obligatorio' })
  id_simulacro: number;

  // Fecha y hora de apertura opcional (por defecto: ahora)
  // Formato ISO 8601, ej: 2026-11-20T08:00:00
  @IsISO8601(
    { strict: true },
    {
      message:
        'La fecha_apertura debe ser una fecha y hora válida (ej: 2026-11-20T08:00:00)',
    },
  )
  @IsOptional()
  fecha_apertura?: string;

  // Fecha y hora de cierre (debe ser posterior a la apertura)
  @IsISO8601(
    { strict: true },
    {
      message:
        'La fecha_cierre debe ser una fecha y hora válida (ej: 2026-11-27T23:59:00)',
    },
  )
  @IsNotEmpty({ message: 'La fecha_cierre es obligatoria' })
  fecha_cierre: string;

  // Intentos permitidos opcional, entero >= 1 (por defecto 1)
  @IsInt({ message: 'Los intentos_max deben ser un número entero' })
  @Min(1, { message: 'Los intentos_max deben ser al menos 1' })
  @IsOptional()
  intentos_max?: number;

  // Campo opcional, por defecto TRUE
  @IsBoolean({ message: 'estado debe ser un valor booleano' })
  @IsOptional()
  estado?: boolean;
}
