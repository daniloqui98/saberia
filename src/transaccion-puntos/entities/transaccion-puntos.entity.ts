import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PerfilEstudiante } from '../../perfil-estudiante/entities/perfil-estudiante.entity.js';

// Decorador @Entity define que esta clase es una entidad de base de datos
// El nombre de la tabla sigue el diccionario de datos: tbl_transaccion_puntos
// Libro contable de los puntos de gamificación de cada estudiante
@Entity('tbl_transaccion_puntos')
export class TransaccionPuntos {
  // Clave primaria auto-incremental
  @PrimaryGeneratedColumn({ name: 'id_transaccion' })
  id_transaccion: number;

  // Llave foránea: cuenta del estudiante afectada
  @Column({ type: 'int', nullable: false })
  id_perfil: number;

  // Relación muchos a uno: un estudiante tiene muchos movimientos
  // RESTRICT impide borrar un perfil que tenga movimientos
  @ManyToOne(() => PerfilEstudiante, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_perfil' })
  perfil: PerfilEstudiante;

  // Naturaleza del movimiento: Ingreso / Egreso
  @Column({ type: 'varchar', length: 20, default: 'Ingreso' })
  tipo: string;

  // Razón de la acreditación o el débito (máx. 100 caracteres)
  @Column({ type: 'varchar', length: 100, nullable: false })
  concepto: string;

  // Cantidad involucrada (siempre en positivo; el tipo dice si suma o resta)
  @Column({ type: 'int', nullable: false })
  puntos: number;

  // Módulo que disparó el movimiento: Sesion / Insignia / Canje
  @Column({ type: 'varchar', length: 50, nullable: false })
  origen_tipo: string;

  // ID del registro que lo originó (sesión, insignia o canje); no es FK directa
  @Column({ type: 'int', nullable: true, default: null })
  origen_id: number | null;

  // Momento del movimiento
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;
}
