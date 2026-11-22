import { IsInt, IsNotEmpty, Min } from 'class-validator';

// Canjear una recompensa: el sistema congela el costo, descuenta los puntos
// y el stock, y deja el canje en estado 'Pendiente'
export class CreateCanjeRecompensaDto {
  // ID del perfil estudiante que canjea
  @IsInt({ message: 'El id_perfil debe ser un número entero' })
  @Min(1, { message: 'El id_perfil debe ser mayor que 0' })
  @IsNotEmpty({ message: 'El id_perfil es obligatorio' })
  id_perfil: number;

  // ID de la recompensa del catálogo
  @IsInt({ message: 'El id_item debe ser un número entero' })
  @Min(1, { message: 'El id_item debe ser mayor que 0' })
  @IsNotEmpty({ message: 'El id_item es obligatorio' })
  id_item: number;
}
