import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

// Iniciar un intento: el sistema pone intento_num, fecha_inicio y estado 'En curso'
export class CreateSesionSimDto {
  // ID del perfil estudiante que presenta la prueba
  @IsInt({ message: 'El id_perfil debe ser un número entero' })
  @Min(1, { message: 'El id_perfil debe ser mayor que 0' })
  @IsNotEmpty({ message: 'El id_perfil es obligatorio' })
  id_perfil: number;

  // ID del simulacro que va a presentar
  @IsInt({ message: 'El id_simulacro debe ser un número entero' })
  @Min(1, { message: 'El id_simulacro debe ser mayor que 0' })
  @IsNotEmpty({ message: 'El id_simulacro es obligatorio' })
  id_simulacro: number;

  // ID de la asignación opcional (si no se envía, es un intento libre)
  @IsInt({ message: 'El id_asignacion debe ser un número entero' })
  @Min(1, { message: 'El id_asignacion debe ser mayor que 0' })
  @IsOptional()
  id_asignacion?: number;
}
