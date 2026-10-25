import { IsInt, IsNotEmpty, IsOptional, Max, Min } from 'class-validator';

// Al crear el perfil se envían el usuario, el semestre y opcionalmente el grupo:
// los atributos derivados (nivel, puntos, rachas) arrancan en 0
export class CreatePerfilEstudianteDto {
  // ID del usuario base (debe existir y tener el rol ESTUDIANTE)
  @IsInt({ message: 'El id_usuario debe ser un número entero' })
  @Min(1, { message: 'El id_usuario debe ser mayor que 0' })
  @IsNotEmpty({ message: 'El id_usuario es obligatorio' })
  id_usuario: number;

  // Semestre actual, entero del 1 al 12
  @IsInt({ message: 'El semestre debe ser un número entero' })
  @Min(1, { message: 'El semestre debe estar entre 1 y 12' })
  @Max(12, { message: 'El semestre debe estar entre 1 y 12' })
  @IsNotEmpty({ message: 'El semestre es obligatorio' })
  semestre: number;

  // ID del grupo opcional (debe existir en tbl_grupo)
  // En el PATCH se puede enviar null para sacar al estudiante del grupo
  @IsInt({ message: 'El id_grupo debe ser un número entero' })
  @Min(1, { message: 'El id_grupo debe ser mayor que 0' })
  @IsOptional()
  id_grupo?: number | null;
}
