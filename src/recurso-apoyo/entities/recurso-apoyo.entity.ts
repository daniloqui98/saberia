import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Competencia } from '../../competencia/entities/competencia.entity.js';

// Decorador @Entity define que esta clase es una entidad de base de datos
// El nombre de la tabla sigue el diccionario de datos: tbl_recurso_apoyo
// Material de estudio que refuerza una competencia
@Entity('tbl_recurso_apoyo')
export class RecursoApoyo {
  // Clave primaria auto-incremental
  @PrimaryGeneratedColumn({ name: 'id_recurso' })
  id_recurso: number;

  // Llave foránea: competencia que refuerza el material
  @Column({ type: 'int', nullable: false })
  id_competencia: number;

  // Relación muchos a uno: una competencia tiene muchos recursos de apoyo
  // RESTRICT impide borrar una competencia que todavía tenga recursos
  @ManyToOne(() => Competencia, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_competencia' })
  competencia: Competencia;

  // Nombre del material (máx. 200 caracteres)
  @Column({ type: 'varchar', length: 200, nullable: false })
  titulo: string;

  // Formato del material: PDF / Video / Enlace / Taller
  @Column({ type: 'varchar', length: 50, nullable: false })
  tipo: string;

  // Hipervínculo (http/https) o ruta física del archivo (máx. 300)
  @Column({ type: 'varchar', length: 300, nullable: false })
  url: string;

  // Sinopsis del contenido (opcional, máx. 500 caracteres)
  @Column({ type: 'varchar', length: 500, nullable: true, default: null })
  descripcion: string | null;
}
