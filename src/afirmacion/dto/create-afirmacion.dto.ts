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

export class CreateAfirmacionDto {
  // ID de la competencia de la que se deriva (debe existir en tbl_competencia)
  @IsInt({ message: 'El id_competencia debe ser un número entero' })
  @Min(1, { message: 'El id_competencia debe ser mayor que 0' })
  @IsNotEmpty({ message: 'El id_competencia es obligatorio' })
  id_competencia: number;

  // Código opcional, alfanumérico, sin espacios y de máximo 20 caracteres
  @IsString({ message: 'El código debe ser una cadena de texto' })
  @MaxLength(20, { message: 'El código debe tener máximo 20 caracteres' })
  @Matches(/^\S+$/, { message: 'El código no debe contener espacios' })
  @IsOptional()
  codigo?: string;

  // Texto de la afirmación de máximo 300 caracteres
  @IsString({ message: 'El texto debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El texto es obligatorio' })
  @MaxLength(300, { message: 'El texto debe tener máximo 300 caracteres' })
  texto: string;

  // Campo opcional, por defecto TRUE
  @IsBoolean({ message: 'activo debe ser un valor booleano' })
  @IsOptional()
  activo?: boolean;
}
