import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsInt, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { CreatePerfilEstudianteDto } from './create-perfil-estudiante.dto.js';

// id_usuario NO se puede cambiar (relación 1:1)
// Los atributos derivados se pueden ajustar a mano por ahora; más adelante
// los calculará el sistema (simulacros, transacciones de puntos, rachas)
export class UpdatePerfilEstudianteDto extends PartialType(
  OmitType(CreatePerfilEstudianteDto, ['id_usuario'] as const),
) {
  // (*) Nivel global entre 0.00 y 300.00, máximo 2 decimales
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El nivel_global debe ser un número con máximo 2 decimales' },
  )
  @Min(0, { message: 'El nivel_global debe estar entre 0 y 300' })
  @Max(300, { message: 'El nivel_global debe estar entre 0 y 300' })
  @IsOptional()
  nivel_global?: number;

  // (*) Puntos totales, entero >= 0
  @IsInt({ message: 'Los puntos_totales deben ser un número entero' })
  @Min(0, { message: 'Los puntos_totales no pueden ser negativos' })
  @IsOptional()
  puntos_totales?: number;

  // (*) Racha actual, entero >= 0
  @IsInt({ message: 'La racha_actual debe ser un número entero' })
  @Min(0, { message: 'La racha_actual no puede ser negativa' })
  @IsOptional()
  racha_actual?: number;

  // (*) Racha máxima, entero >= 0
  @IsInt({ message: 'La racha_maxima debe ser un número entero' })
  @Min(0, { message: 'La racha_maxima no puede ser negativa' })
  @IsOptional()
  racha_maxima?: number;
}
