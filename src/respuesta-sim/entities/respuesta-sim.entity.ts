import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { SesionSim } from '../../sesion-sim/entities/sesion-sim.entity.js';
import { SimPregunta } from '../../sim-pregunta/entities/sim-pregunta.entity.js';
import { Opcion } from '../../opcion/entities/opcion.entity.js';

// Decorador @Entity define que esta clase es una entidad de base de datos
// El nombre de la tabla sigue el diccionario de datos: tbl_respuesta_sim
// Regla: en una sesión cada pregunta del simulacro se responde una sola vez
@Entity('tbl_respuesta_sim')
@Unique('UQ_respuesta_sesion_pregunta', ['id_sesion', 'id_sim_pregunta'])
export class RespuestaSim {
  // Clave primaria auto-incremental
  @PrimaryGeneratedColumn({ name: 'id_respuesta' })
  id_respuesta: number;

  // Llave foránea: sesión en la que se responde
  @Column({ type: 'int', nullable: false })
  id_sesion: number;

  // Relación muchos a uno: una sesión tiene muchas respuestas
  @ManyToOne(() => SesionSim, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_sesion' })
  sesion: SesionSim;

  // Llave foránea: pregunta del simulacro que se está respondiendo
  @Column({ type: 'int', nullable: false })
  id_sim_pregunta: number;

  // Relación muchos a uno: una pregunta del simulacro recibe muchas respuestas
  @ManyToOne(() => SimPregunta, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_sim_pregunta' })
  simPregunta: SimPregunta;

  // Llave foránea opcional: opción marcada (NULL = en blanco)
  @Column({ type: 'int', nullable: true, default: null })
  id_opcion: number | null;

  // Relación muchos a uno: una opción la marcan muchos estudiantes
  @ManyToOne(() => Opcion, {
    nullable: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_opcion' })
  opcion: Opcion | null;

  // Si la opción elegida era la correcta (NULL si quedó en blanco)
  // La calcula el sistema a partir de la opción
  @Column({ type: 'boolean', nullable: true, default: null })
  es_correcta: boolean | null;

  // Segundos dedicados a esta pregunta
  @Column({ type: 'int', default: 0 })
  tiempo_seg: number;

  // El estudiante marcó la pregunta para revisarla después
  @Column({ type: 'boolean', default: false })
  marcada_revision: boolean;

  // Momento exacto en que se registró o cambió la selección
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_respuesta: Date;
}
