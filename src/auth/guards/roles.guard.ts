import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator.js';
import { User } from '../../user/entities/user.entity.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles: string[] | undefined =
      this.reflector.getAllAndOverride<string[] | undefined>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

    // Si no se especificaron roles, permitir acceso
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context
      .switchToHttp()
      .getRequest<{ user?: User }>();

    // No hay usuario autenticado
    if (!user) {
      throw new UnauthorizedException('Debes iniciar sesión');
    }

    // El rol del usuario (tbl_rol) debe estar entre los roles requeridos
    // La estrategia JWT carga user.rol desde la base de datos en cada petición
    if (!user.rol || !requiredRoles.includes(user.rol.nombre)) {
      throw new ForbiddenException(
        'No tienes permisos para este recurso',
      );
    }

    return true;
  }
}