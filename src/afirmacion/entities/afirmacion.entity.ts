import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Competencia } from '../../competencia/entities/competencia.entity.js';

// Decorador @Entity define que esta clase es una entidad de base de datos
// El nombre de la tabla sigue el diccionario de datos: tbl_afirmacion
@Entity('tbl_afirmacion')
export class Afirmacion {
  // Clave primaria auto-incremental
  @PrimaryGeneratedColumn({ name: 'id_afirmacion' })
  id_afirmacion: number;

  // Llave foránea: competencia de la que se deriva la afirmación
  @Column({ type: 'int', nullable: false })
  id_competencia: number;

  // Relación muchos a uno: una competencia tiene muchas afirmaciones
  // RESTRICT impide borrar una competencia que todavía tenga afirmaciones
  @ManyToOne(() => Competencia, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_competencia' })
  competencia: Competencia;

  // Referencia interna de la afirmación (opcional, no es única, máx. 20)
  @Column({ type: 'varchar', length: 20, nullable: true, default: null })
  codigo: string | null;

  // Contenido textual de la afirmación (máx. 300 caracteres)
  @Column({ type: 'varchar', length: 300, nullable: false })
  texto: string;

  // Vigencia de la afirmación
  @Column({ type: 'boolean', default: true })
  activo: boolean;
}
