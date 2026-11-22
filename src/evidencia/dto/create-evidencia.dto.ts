import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateEvidenciaDto {
  // ID de la afirmación a la que tributa (debe existir en tbl_afirmacion)
  @IsInt({ message: 'El id_afirmacion debe ser un número entero' })
  @Min(1, { message: 'El id_afirmacion debe ser mayor que 0' })
  @IsNotEmpty({ message: 'El id_afirmacion es obligatorio' })
  id_afirmacion: number;

  // Código opcional, alfanumérico, sin espacios y de máximo 20 caracteres
  @IsString({ message: 'El código debe ser una cadena de texto' })
  @MaxLength(20, { message: 'El código debe tener máximo 20 caracteres' })
  @Matches(/^\S+$/, { message: 'El código no debe contener espacios' })
  @IsOptional()
  codigo?: string;

  // Acción observable esperada, de máximo 400 caracteres
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  @MaxLength(400, { message: 'La descripción debe tener máximo 400 caracteres' })
  descripcion: string;

  // Campo opcional, por defecto TRUE
  @IsBoolean({ message: 'activo debe ser un valor booleano' })
  @IsOptional()
  activo?: boolean;
}
