import { IsIn, IsNotEmpty } from 'class-validator';

// Terminar un intento: se pasa de 'En curso' a 'Finalizado' o 'Abandonado'
// El sistema pone fecha_fin y tiempo_total_seg; el puntaje_total se calcula
// solo con las respuestas (tbl_respuesta_sim)
export class UpdateSesionSimDto {
  // Nuevo estado del intento
  @IsIn(['Finalizado', 'Abandonado'], {
    message: 'El estado debe ser Finalizado o Abandonado',
  })
  @IsNotEmpty({ message: 'El estado es obligatorio' })
  estado: string;
}
