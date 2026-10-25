import {
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  // Tipo de documento opcional, por defecto 'CC'
  @IsIn(['CC', 'TI', 'CE', 'PAS'], {
    message: 'El tipo de documento debe ser CC, TI, CE o PAS',
  })
  @IsOptional()
  tipo_documento?: string;

  // Número de documento único, alfanumérico y de máximo 20 caracteres
  @IsString({ message: 'El número de documento debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El número de documento es obligatorio' })
  @MaxLength(20, {
    message: 'El número de documento debe tener máximo 20 caracteres',
  })
  @Matches(/^[A-Za-z0-9]+$/, {
    message: 'El número de documento solo puede tener letras y números',
  })
  num_documento: string;

  // Nombres: solo letras (se permiten tildes, ñ y espacios)
  @IsString({ message: 'Los nombres deben ser una cadena de texto' })
  @IsNotEmpty({ message: 'Los nombres son obligatorios' })
  @MaxLength(100, { message: 'Los nombres deben tener máximo 100 caracteres' })
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]+$/, {
    message: 'Los nombres solo pueden contener letras',
  })
  nombres: string;

  // Apellidos: solo letras (se permiten tildes, ñ y espacios)
  @IsString({ message: 'Los apellidos deben ser una cadena de texto' })
  @IsNotEmpty({ message: 'Los apellidos son obligatorios' })
  @MaxLength(100, { message: 'Los apellidos deben tener máximo 100 caracteres' })
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]+$/, {
    message: 'Los apellidos solo pueden contener letras',
  })
  apellidos: string;

  // Validación de correo con formato correcto
  @IsEmail({}, { message: 'El correo debe ser válido' })
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  @MaxLength(120, { message: 'El correo debe tener máximo 120 caracteres' })
  correo: string;

  // Contraseña en texto plano (se guarda encriptada en contrasena_hash)
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  contrasena: string;

  // ID del programa opcional (debe existir en tbl_programa)
  @IsInt({ message: 'El id_programa debe ser un número entero' })
  @Min(1, { message: 'El id_programa debe ser mayor que 0' })
  @IsOptional()
  id_programa?: number;

  // ID del rol (debe existir en tbl_rol)
  // Es opcional en el JSON: si no se envía, se asigna el rol ESTUDIANTE
  @IsInt({ message: 'El id_rol debe ser un número entero' })
  @Min(1, { message: 'El id_rol debe ser mayor que 0' })
  @IsOptional()
  id_rol?: number;
}
