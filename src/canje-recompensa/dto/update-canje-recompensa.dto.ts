import { IsIn, IsNotEmpty } from 'class-validator';

// Cambiar el estado de un canje 'Pendiente':
// 'Entregado' = se entregó el premio; 'Anulado' = se devuelven puntos y stock
export class UpdateCanjeRecompensaDto {
  @IsIn(['Entregado', 'Anulado'], {
    message: 'El estado debe ser Entregado o Anulado',
  })
  @IsNotEmpty({ message: 'El estado es obligatorio' })
  estado: string;
}
