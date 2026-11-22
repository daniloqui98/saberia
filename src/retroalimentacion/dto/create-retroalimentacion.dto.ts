import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

// Retroalimentación escrita por un docente (origen = 'Docente')
// La del sistema se crea con POST /retroalimentaciones/generar/:idDesempeno
export class CreateRetroalimentacionDto {
  // ID del desempeño que origina el consejo
  @IsInt({ message: 'El id_desempeno debe ser un número entero' })
  @Min(1, { message: 'El id_desempeno debe ser mayor que 0' })
  @IsNotEmpty({ message: 'El id_desempeno es obligatorio' })
  id_desempeno: number;

  // ID del recurso sugerido opcional (debe ser de la misma competencia)
  @IsInt({ message: 'El id_recurso debe ser un número entero' })
  @Min(1, { message: 'El id_recurso debe ser mayor que 0' })
  @IsOptional()
  id_recurso?: number | null;

  // Descripción de la falencia o fortaleza
  @IsString({ message: 'El mensaje debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El mensaje es obligatorio' })
  mensaje: string;

  // Acción de mejora opcional
  @IsString({ message: 'La recomendación debe ser una cadena de texto' })
  @IsOptional()
  recomendacion?: string;
}
