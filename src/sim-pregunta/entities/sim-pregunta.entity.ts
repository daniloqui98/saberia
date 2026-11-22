import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Simulacro } from '../../simulacro/entities/simulacro.entity.js';
import { Pregunta } from '../../pregunta/entities/pregunta.entity.js';

// Tabla intermedia entre simulacros y preguntas, con llave primaria propia
// El nombre de la tabla sigue el diccionario de datos: tbl_sim_pregunta
// Reglas: el orden es único por simulacro y una pregunta no se repite en el mismo simulacro
@Entity('tbl_sim_pregunta')
@Unique('UQ_sim_pregunta_orden', ['id_simulacro', 'orden'])
@Unique('UQ_sim_pregunta_pregunta', ['id_simulacro', 'id_pregunta'])
export class SimPregunta {
  // Clave primaria auto-incremental (identificador propio de la relación)
  @PrimaryGeneratedColumn({ name: 'id_sim_pregunta' })
  id_sim_pregunta: number;

  // Llave foránea: simulacro al que se añade la pregunta
  @Column({ type: 'int', nullable: false })
  id_simulacro: number;

  // Relación muchos a uno: un simulacro tiene muchas preguntas
  // RESTRICT impide borrar un simulacro que todavía tenga preguntas
  @ManyToOne(() => Simulacro, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_simulacro' })
  simulacro: Simulacro;

  // Llave foránea: pregunta añadida al simulacro
  @Column({ type: 'int', nullable: false })
  id_pregunta: number;

  // Relación muchos a uno: una pregunta puede estar en muchos simulacros
  // RESTRICT impide borrar una pregunta que esté en algún simulacro
  @ManyToOne(() => Pregunta, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_pregunta' })
  pregunta: Pregunta;

  // Posición en la que se muestra la pregunta (>= 1, única por simulacro)
  @Column({ type: 'int', default: 1 })
  orden: number;

  // Peso específico de la pregunta en el simulacro (> 0)
  // El transformer convierte el texto que devuelve MySQL en número
  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 1,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number(value),
    },
  })
  puntaje: number;
}
