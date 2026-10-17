import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreatePeriodoAcademicoDto {
  // Código único, alfanumérico, sin espacios y de máximo 10 caracteres
  @IsString({ message: 'El código debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El código es obligatorio' })
  @MaxLength(10, { message: 'El código debe tener máximo 10 caracteres' })
  @Matches(/^\S+$/, { message: 'El código no debe contener espacios' })
  codigo: string;

  // Fecha de inicio en formato YYYY-MM-DD
  @IsNotEmpty({ message: 'La fecha de inicio es obligatoria' })
  @IsDateString(
    { strict: true },
    { message: 'La fecha de inicio debe ser una fecha válida' },
  )
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'La fecha de inicio debe tener el formato YYYY-MM-DD',
  })
  fecha_inicio: string;

  // Fecha de fin en formato YYYY-MM-DD
  @IsNotEmpty({ message: 'La fecha de fin es obligatoria' })
  @IsDateString(
    { strict: true },
    { message: 'La fecha de fin debe ser una fecha válida' },
  )
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'La fecha de fin debe tener el formato YYYY-MM-DD',
  })
  fecha_fin: string;

  // Campo opcional, por defecto FALSE
  @IsBoolean({ message: 'activo debe ser un valor booleano' })
  @IsOptional()
  activo?: boolean;
}
