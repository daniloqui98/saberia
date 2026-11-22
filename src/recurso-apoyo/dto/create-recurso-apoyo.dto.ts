import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateRecursoApoyoDto {
  // ID de la competencia que refuerza (debe existir en tbl_competencia)
  @IsInt({ message: 'El id_competencia debe ser un número entero' })
  @Min(1, { message: 'El id_competencia debe ser mayor que 0' })
  @IsNotEmpty({ message: 'El id_competencia es obligatorio' })
  id_competencia: number;

  // Título del material de máximo 200 caracteres
  @IsString({ message: 'El título debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El título es obligatorio' })
  @MaxLength(200, { message: 'El título debe tener máximo 200 caracteres' })
  titulo: string;

  // Formato del material
  @IsIn(['PDF', 'Video', 'Enlace', 'Taller'], {
    message: 'El tipo debe ser PDF, Video, Enlace o Taller',
  })
  @IsNotEmpty({ message: 'El tipo es obligatorio' })
  tipo: string;

  // Hipervínculo (http:// o https://) o ruta física que empiece por /
  @IsString({ message: 'La url debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La url es obligatoria' })
  @MaxLength(300, { message: 'La url debe tener máximo 300 caracteres' })
  @Matches(/^(https?:\/\/\S+|\/\S+)$/, {
    message:
      'La url debe empezar por http:// o https://, o ser una ruta que empiece por /',
  })
  url: string;

  // Descripción opcional de máximo 500 caracteres
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MaxLength(500, { message: 'La descripción debe tener máximo 500 caracteres' })
  @IsOptional()
  descripcion?: string;
}
