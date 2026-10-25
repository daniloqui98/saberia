import {
  IsIn,
  IsInt,
  IsIP,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateLogAccionDto {
  // ID del usuario que ejecuta la acción (debe existir en tbl_usuario)
  @IsInt({ message: 'El id_usuario debe ser un número entero' })
  @Min(1, { message: 'El id_usuario debe ser mayor que 0' })
  @IsNotEmpty({ message: 'El id_usuario es obligatorio' })
  id_usuario: number;

  // Operación realizada
  @IsIn(['CREATE', 'UPDATE', 'DELETE'], {
    message: 'La acción debe ser CREATE, UPDATE o DELETE',
  })
  @IsNotEmpty({ message: 'La acción es obligatoria' })
  accion: string;

  // Tabla afectada, de máximo 50 caracteres
  @IsString({ message: 'La entidad debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La entidad es obligatoria' })
  @MaxLength(50, { message: 'La entidad debe tener máximo 50 caracteres' })
  entidad: string;

  // ID del registro afectado, entero mayor que 0
  @IsInt({ message: 'El id_entidad debe ser un número entero' })
  @Min(1, { message: 'El id_entidad debe ser mayor que 0' })
  @IsNotEmpty({ message: 'El id_entidad es obligatorio' })
  id_entidad: number;

  // Valor anterior opcional (JSON o texto), máximo 500 caracteres
  @IsString({ message: 'El valor_antes debe ser una cadena de texto' })
  @MaxLength(500, { message: 'El valor_antes debe tener máximo 500 caracteres' })
  @IsOptional()
  valor_antes?: string;

  // Valor nuevo opcional (JSON o texto), máximo 500 caracteres
  @IsString({ message: 'El valor_despues debe ser una cadena de texto' })
  @MaxLength(500, {
    message: 'El valor_despues debe tener máximo 500 caracteres',
  })
  @IsOptional()
  valor_despues?: string;

  // IP opcional en el JSON: si no se envía, se toma la IP de la petición
  @IsIP(undefined, { message: 'La ip_origen debe ser una IPv4 o IPv6 válida' })
  @IsOptional()
  ip_origen?: string;
}
