import { IsInt, IsNotEmpty, Min } from 'class-validator';

// Otorgar una insignia: el sistema pone la fecha y abona los puntos bonus
export class CreateInsigniaEstudianteDto {
  // ID del perfil estudiante que gana la insignia
  @IsInt({ message: 'El id_perfil debe ser un número entero' })
  @Min(1, { message: 'El id_perfil debe ser mayor que 0' })
  @IsNotEmpty({ message: 'El id_perfil es obligatorio' })
  id_perfil: number;

  // ID de la insignia del catálogo
  @IsInt({ message: 'El id_badge debe ser un número entero' })
  @Min(1, { message: 'El id_badge debe ser mayor que 0' })
  @IsNotEmpty({ message: 'El id_badge es obligatorio' })
  id_badge: number;
}
