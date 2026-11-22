import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { SesionSim } from '../../sesion-sim/entities/sesion-sim.entity.js';
import { Competencia } from '../../competencia/entities/competencia.entity.js';

// Decorador @Entity define que esta clase es una entidad de base de datos
// El nombre de la tabla sigue el diccionario de datos: tbl_desempeno_competencia
// Resultado de una sesión por cada competencia evaluada (lo calcula el sistema)
@Entity('tbl_desempeno_competencia')
@Unique('UQ_desempeno_sesion_competencia', ['id_sesion', 'id_competencia'])
export class DesempenoCompetencia {
  // Clave primaria auto-incremental
  @PrimaryGeneratedColumn({ name: 'id_desempeno' })
  id_desempeno: number;

  // Llave foránea: sesión evaluada
  @Column({ type: 'int', nullable: false })
  id_sesion: number;

  // Relación muchos a uno: una sesión tiene un desempeño por competencia
  @ManyToOne(() => SesionSim, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_sesion' })
  sesion: SesionSim;

  // Llave foránea: competencia analizada
  @Column({ type: 'int', nullable: false })
  id_competencia: number;

  // Relación muchos a uno: una competencia aparece en muchos desempeños
  @ManyToOne(() => Competencia, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_competencia' })
  competencia: Competencia;

  // Número de preguntas acertadas (<= total_preguntas)
  @Column({ type: 'int', default: 0 })
  correctas: number;

  // Preguntas evaluadas para esa competencia (> 0)
  @Column({ type: 'int', default: 0 })
  total_preguntas: number;

  // Nivel de acierto porcentual (0 a 100)
  // El transformer convierte el texto que devuelve MySQL en número
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
  porcentaje: number;

  // Clasificación cualitativa (niveles del ICFES): Nivel 1 / 2 / 3 / 4
  // En el módulo de Inglés: -A1 / A1 / A2 / B1 / B2 (bandas MCER)
  @Column({ type: 'varchar', length: 30, nullable: false })
  nivel_logro: string;

  // Momento en que se calculó
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_generacion: Date;
}
