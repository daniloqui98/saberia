import { CustomDecorator, SetMetadata } from '@nestjs/common';

/**
 * Decorador para especificar roles requeridos
 * Uso: @Roles('ADMINISTRADOR', 'DOCENTE') (nombres de tbl_rol)
 */
export const ROLES_KEY = 'roles';

export const Roles = (...roles: string[]): CustomDecorator<string> =>
  SetMetadata(ROLES_KEY, roles);