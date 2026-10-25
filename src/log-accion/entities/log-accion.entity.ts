import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity.js';

// Decorador @Entity define que esta clase es una entidad de base de datos
// El nombre de la tabla sigue el diccionario de datos: tbl_log_acciones
@Entity('tbl_log_acciones')
export class LogAccion {
  // Clave primaria auto-incremental
  @PrimaryGeneratedColumn({ name: 'id_log' })
  id_log: number;

  // Llave foránea: usuario que ejecuta la acción
  @Column({ type: 'int', nullable: false })
  id_usuario: number;

  // Relación muchos a uno: un usuario tiene muchos registros de log
  // RESTRICT impide borrar un usuario que tenga acciones registradas
  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_usuario' })
  usuario: User;

  // Operación realizada: CREATE / UPDATE / DELETE
  @Column({ type: 'varchar', length: 20, nullable: false })
  accion: string;

  // Tabla en la que ocurre la acción (ej: tbl_usuario)
  @Column({ type: 'varchar', length: 50, nullable: false })
  entidad: string;

  // Identificador del registro afectado (no es FK directa)
  @Column({ type: 'int', nullable: false })
  id_entidad: number;

  // Estado del registro antes del cambio (JSON / texto, opcional)
  @Column({ type: 'varchar', length: 500, nullable: true, default: null })
  valor_antes: string | null;

  // Estado del registro tras el cambio (JSON / texto, opcional)
  @Column({ type: 'varchar', length: 500, nullable: true, default: null })
  valor_despues: string | null;

  // Dirección IP desde donde se ejecutó (IPv4 / IPv6)
  @Column({ type: 'varchar', length: 45, nullable: false })
  ip_origen: string;

  // Fecha y hora de la transacción (campo de auditoría)
  @CreateDateColumn({ type: 'timestamp' })
  fecha: Date;
}
