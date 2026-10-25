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

export class CreateGrupoDto {
  // Código único, alfanumérico, sin espacios y de máximo 20 caracteres
  @IsString({ message: 'El código debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El código es obligatorio' })
  @MaxLength(20, { message: 'El código debe tener máximo 20 caracteres' })
  @Matches(/^\S+$/, { message: 'El código no debe contener espacios' })
  codigo: string;

  // Nombre del grupo de máximo 100 caracteres
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(100, { message: 'El nombre debe tener máximo 100 caracteres' })
  nombre: string;

  // ID del perfil docente responsable (debe existir en tbl_perfil_docente)
  @IsInt({ message: 'El id_docente debe ser un número entero' })
  @Min(1, { message: 'El id_docente debe ser mayor que 0' })
  @IsNotEmpty({ message: 'El id_docente es obligatorio' })
  id_docente: number;

  // ID del programa (debe existir en tbl_programa)
  @IsInt({ message: 'El id_programa debe ser un número entero' })
  @Min(1, { message: 'El id_programa debe ser mayor que 0' })
  @IsNotEmpty({ message: 'El id_programa es obligatorio' })
  id_programa: number;

  // ID del periodo académico (debe existir en tbl_periodo_academico)
  @IsInt({ message: 'El id_periodo debe ser un número entero' })
  @Min(1, { message: 'El id_periodo debe ser mayor que 0' })
  @IsNotEmpty({ message: 'El id_periodo es obligatorio' })
  id_periodo: number;

  // Campo opcional, por defecto TRUE
  @IsBoolean({ message: 'estado debe ser un valor booleano' })
  @IsOptional()
  estado?: boolean;
}
