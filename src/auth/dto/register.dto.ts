import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../../user/dto/create-user.dto.js';

// El registro público NO permite elegir el rol (se asigna ESTUDIANTE)
// así nadie puede registrarse como ADMINISTRADOR
export class RegisterDto extends OmitType(CreateUserDto, ['id_rol'] as const) {}
