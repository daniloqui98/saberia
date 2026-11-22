import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AsignacionSimulacro } from '../../asignacion-simulacro/entities/asignacion-simulacro.entity.js';

// Decorador @Entity define que esta clase es una entidad de base de datos
// El nombre de la tabla sigue el diccionario de datos: tbl_reporte_grupo
// Estadística consolidada de un grupo en una asignación (la calcula el sistema)
@Entity('tbl_reporte_grupo')
export class ReporteGrupo {
  // Clave primaria auto-incremental
  @PrimaryGeneratedColumn({ name: 'id_reporte' })
  id_reporte: number;

  // Llave foránea: asignación que se consolida
  @Column({ type: 'int', nullable: false })
  id_asignacion: number;

  // Relación muchos a uno: una asignación tiene su reporte
  // RESTRICT impide borrar una asignación que tenga reporte
  @ManyToOne(() => AsignacionSimulacro, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_asignacion' })
  asignacion: AsignacionSimulacro;

  // Cuándo se procesó la estadística
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_generacion: Date;

  // Nota media del grupo (promedio del mejor intento de cada estudiante)
  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number(value),
    },
  })
  promedio_general: number;

  // Número de estudiantes que completaron (al menos un intento Finalizado)
  @Column({ type: 'int', default: 0 })
  total_estudiantes: number;

  // % de estudiantes que presentaron frente a los matriculados en el grupo
  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number(value),
    },
  })
  tasa_participacion: number;

  // Notas del docente sobre el grupo (opcional)
  @Column({ type: 'text', nullable: true, default: null })
  observaciones: string | null;
}
