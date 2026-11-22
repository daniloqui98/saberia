import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateTransaccionPuntosDto {
  // ID del perfil estudiante (debe existir)
  @IsInt({ message: 'El id_perfil debe ser un número entero' })
  @Min(1, { message: 'El id_perfil debe ser mayor que 0' })
  @IsNotEmpty({ message: 'El id_perfil es obligatorio' })
  id_perfil: number;

  // Tipo opcional, por defecto 'Ingreso'
  @IsIn(['Ingreso', 'Egreso'], {
    message: 'El tipo debe ser Ingreso o Egreso',
  })
  @IsOptional()
  tipo?: string;

  // Razón del movimiento de máximo 100 caracteres
  @IsString({ message: 'El concepto debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El concepto es obligatorio' })
  @MaxLength(100, { message: 'El concepto debe tener máximo 100 caracteres' })
  concepto: string;

  // Puntos siempre en positivo (mayor que 0)
  @IsInt({ message: 'Los puntos deben ser un número entero' })
  @Min(1, { message: 'Los puntos deben ser mayores que 0 (siempre en positivo)' })
  @IsNotEmpty({ message: 'Los puntos son obligatorios' })
  puntos: number;

  // Módulo que originó el movimiento
  @IsIn(['Sesion', 'Insignia', 'Canje'], {
    message: 'El origen_tipo debe ser Sesion, Insignia o Canje',
  })
  @IsNotEmpty({ message: 'El origen_tipo es obligatorio' })
  origen_tipo: string;

  // ID del registro de origen opcional
  @IsInt({ message: 'El origen_id debe ser un número entero' })
  @Min(1, { message: 'El origen_id debe ser mayor que 0' })
  @IsOptional()
  origen_id?: number;
}
