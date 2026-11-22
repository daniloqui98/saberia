import { IsOptional, IsString } from 'class-validator';

// Las cifras del reporte las calcula el sistema; el docente solo escribe observaciones
export class UpdateReporteGrupoDto {
  // Notas sobre el grupo (null para borrarlas)
  @IsString({ message: 'Las observaciones deben ser una cadena de texto' })
  @IsOptional()
  observaciones?: string | null;
}
