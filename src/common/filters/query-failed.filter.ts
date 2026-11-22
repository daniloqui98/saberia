import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

// Errores de MySQL / MariaDB que no son fallas del servidor, sino del dato
const ER_DUP_ENTRY = 1062; // se repite un valor de un índice UNIQUE
const ER_ROW_IS_REFERENCED_2 = 1451; // se intenta borrar un registro que otros usan

/**
 * Filtro global para errores de la base de datos.
 * Las validaciones de los servicios ya responden 409 antes de guardar, pero
 * si dos peticiones llegan al mismo tiempo, la base de datos es la que detiene
 * la segunda: aquí ese error se convierte en un 409 en vez de un 500.
 */
@Catch(QueryFailedError)
export class QueryFailedFilter implements ExceptionFilter {
  catch(error: QueryFailedError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const errno = (error.driverError as { errno?: number } | undefined)?.errno;

    if (errno === ER_DUP_ENTRY) {
      response.status(HttpStatus.CONFLICT).json({
        message: 'Ya existe un registro con esos datos únicos',
        error: 'Conflict',
        statusCode: HttpStatus.CONFLICT,
      });
      return;
    }

    if (errno === ER_ROW_IS_REFERENCED_2) {
      response.status(HttpStatus.CONFLICT).json({
        message: 'No se puede eliminar el registro porque tiene registros asociados',
        error: 'Conflict',
        statusCode: HttpStatus.CONFLICT,
      });
      return;
    }

    // Cualquier otro error de la base de datos sigue siendo un 500
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal server error',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
