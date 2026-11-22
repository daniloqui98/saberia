import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Grupo } from '../../grupo/entities/grupo.entity.js';
import { Simulacro } from '../../simulacro/entities/simulacro.entity.js';

// Decorador @Entity define que esta clase es una entidad de base de datos
// El nombre de la tabla sigue el diccionario de datos: tbl_asignacion_simulacro
// Programa un simulacro para un grupo dentro de una ventana de fechas
@Entity('tbl_asignacion_simulacro')
export class AsignacionSimulacro {
  // Clave primaria auto-incremental
  @PrimaryGeneratedColumn({ name: 'id_asignacion' })
  id_asignacion: number;

  // Llave foránea: grupo al que se le aplica la prueba
  @Column({ type: 'int', nullable: false })
  id_grupo: number;

  // Relación muchos a uno: un grupo recibe muchas asignaciones
  // RESTRICT impide borrar un grupo que tenga asignaciones
  @ManyToOne(() => Grupo, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_grupo' })
  grupo: Grupo;

  // Llave foránea: simulacro a resolver
  @Column({ type: 'int', nullable: false })
  id_simulacro: number;

  // Relación muchos a uno: un simulacro se asigna muchas veces
  // RESTRICT impide borrar un simulacro que tenga asignaciones
  @ManyToOne(() => Simulacro, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_simulacro' })
  simulacro: Simulacro;

  // Momento desde el que se puede iniciar (por defecto: ahora)
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_apertura: Date;

  // Límite máximo para finalizar (debe ser posterior a la apertura)
  @Column({ type: 'timestamp', nullable: false })
  fecha_cierre: Date;

  // Veces permitidas para realizar la prueba (>= 1)
  @Column({ type: 'int', default: 1 })
  intentos_max: number;

  // Habilita / inhabilita la asignación
  @Column({ type: 'boolean', default: true })
  estado: boolean;
}
