import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Evidencia } from '../../evidencia/entities/evidencia.entity.js';
import { User } from '../../user/entities/user.entity.js';

// Decorador @Entity define que esta clase es una entidad de base de datos
// El nombre de la tabla sigue el diccionario de datos: tbl_pregunta
@Entity('tbl_pregunta')
export class Pregunta {
  // Clave primaria auto-incremental
  @PrimaryGeneratedColumn({ name: 'id_pregunta' })
  id_pregunta: number;

  // Llave foránea: evidencia específica que mide la pregunta
  @Column({ type: 'int', nullable: false })
  id_evidencia: number;

  // Relación muchos a uno: una evidencia se mide con muchas preguntas
  // RESTRICT impide borrar una evidencia que todavía tenga preguntas
  @ManyToOne(() => Evidencia, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_evidencia' })
  evidencia: Evidencia;

  // Llave foránea opcional: usuario docente que creó la pregunta
  @Column({ type: 'int', nullable: true, default: null })
  id_autor: number | null;

  // Relación muchos a uno: un docente crea muchas preguntas
  // SET NULL: si se elimina el autor, la pregunta se conserva sin autor
  @ManyToOne(() => User, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_autor' })
  autor: User | null;

  // Formulación directa de la pregunta
  @Column({ type: 'text', nullable: false })
  enunciado: string;

  // Situación o lectura base (opcional)
  @Column({ type: 'text', nullable: true, default: null })
  contexto: string | null;

  // Clasificación estructural: Seleccion multiple / Abierta
  @Column({ type: 'varchar', length: 30, default: 'Seleccion multiple' })
  tipo: string;

  // Nivel de complejidad estimado (0.00 - 5.00)
  // El transformer convierte el texto que devuelve MySQL en número
  @Column({
    type: 'decimal',
    precision: 3,
    scale: 2,
    nullable: true,
    default: 1,
    transformer: {
      to: (value: number | null) => value,
      from: (value: string | null) => (value === null ? null : Number(value)),
    },
  })
  dificultad: number | null;

  // Peso de la pregunta (>= 0)
  @Column({ type: 'int', default: 1 })
  puntaje: number;

  // Argumentación técnica de la respuesta (opcional)
  @Column({ type: 'text', nullable: true, default: null })
  justificacion: string | null;

  // Procedencia del ítem (ej: Cuadernillo ICFES 2021)
  @Column({ type: 'varchar', length: 50, default: 'Propia' })
  origen: string;

  // Número de revisión del ítem (>= 1), sube solo al editar el contenido
  @Column({ type: 'int', default: 1 })
  version: number;

  // Disponibilidad para simulacros
  @Column({ type: 'boolean', default: true })
  activa: boolean;

  // Registro temporal de incorporación (se llena solo)
  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;
}
