import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Min,
} from 'class-validator';

// es_correcta y fecha_respuesta no se envían: el sistema las calcula
export class CreateRespuestaSimDto {
  // ID de la sesión (debe estar 'En curso')
  @IsInt({ message: 'El id_sesion debe ser un número entero' })
  @Min(1, { message: 'El id_sesion debe ser mayor que 0' })
  @IsNotEmpty({ message: 'El id_sesion es obligatorio' })
  id_sesion: number;

  // ID de la pregunta del simulacro (debe ser del simulacro de la sesión)
  @IsInt({ message: 'El id_sim_pregunta debe ser un número entero' })
  @Min(1, { message: 'El id_sim_pregunta debe ser mayor que 0' })
  @IsNotEmpty({ message: 'El id_sim_pregunta es obligatorio' })
  id_sim_pregunta: number;

  // ID de la opción marcada; si no se envía o es null, queda en blanco
  @IsInt({ message: 'El id_opcion debe ser un número entero' })
  @Min(1, { message: 'El id_opcion debe ser mayor que 0' })
  @IsOptional()
  id_opcion?: number | null;

  // Segundos dedicados opcional, entero >= 0 (por defecto 0)
  @IsInt({ message: 'El tiempo_seg debe ser un número entero' })
  @Min(0, { message: 'El tiempo_seg no puede ser negativo' })
  @IsOptional()
  tiempo_seg?: number;

  // Campo opcional, por defecto FALSE
  @IsBoolean({ message: 'marcada_revision debe ser un valor booleano' })
  @IsOptional()
  marcada_revision?: boolean;
}
