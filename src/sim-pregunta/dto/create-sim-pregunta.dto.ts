import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export class CreateSimPreguntaDto {
  // ID del simulacro (debe existir en tbl_simulacro)
  @IsInt({ message: 'El id_simulacro debe ser un número entero' })
  @Min(1, { message: 'El id_simulacro debe ser mayor que 0' })
  @IsNotEmpty({ message: 'El id_simulacro es obligatorio' })
  id_simulacro: number;

  // ID de la pregunta (debe existir en tbl_pregunta y estar activa)
  @IsInt({ message: 'El id_pregunta debe ser un número entero' })
  @Min(1, { message: 'El id_pregunta debe ser mayor que 0' })
  @IsNotEmpty({ message: 'El id_pregunta es obligatorio' })
  id_pregunta: number;

  // Posición opcional >= 1: si no se envía, va al final del simulacro
  @IsInt({ message: 'El orden debe ser un número entero' })
  @Min(1, { message: 'El orden debe ser mayor o igual a 1' })
  @IsOptional()
  orden?: number;

  // Puntaje opcional > 0, máximo 2 decimales (por defecto 1.00)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El puntaje debe ser un número con máximo 2 decimales' },
  )
  @Min(0.01, { message: 'El puntaje debe ser mayor que 0' })
  @Max(999.99, { message: 'El puntaje debe ser máximo 999.99' })
  @IsOptional()
  puntaje?: number;
}
