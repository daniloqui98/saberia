import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PerfilDocente } from '../../perfil-docente/entities/perfil-docente.entity.js';
import { Programa } from '../../programa/entities/programa.entity.js';
import { PeriodoAcademico } from '../../periodo-academico/entities/periodo-academico.entity.js';

// Decorador @Entity define que esta clase es una entidad de base de datos
// El nombre de la tabla sigue el diccionario de datos: tbl_grupo
@Entity('tbl_grupo')
export class Grupo {
  // Clave primaria auto-incremental
  @PrimaryGeneratedColumn({ name: 'id_grupo' })
  id_grupo: number;

  // Identificador corto para estudiantes (único, máx. 20 caracteres)
  @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
  codigo: string;

  // Etiqueta descriptiva del grupo (máx. 100 caracteres)
  @Column({ type: 'varchar', length: 100, nullable: false })
  nombre: string;

  // Llave foránea: docente responsable del grupo
  @Column({ type: 'int', nullable: false })
  id_docente: number;

  // Relación muchos a uno: un docente dirige muchos grupos
  @ManyToOne(() => PerfilDocente, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_docente' })
  docente: PerfilDocente;

  // Llave foránea: programa al que se asocia el grupo
  @Column({ type: 'int', nullable: false })
  id_programa: number;

  // Relación muchos a uno: un programa tiene muchos grupos
  @ManyToOne(() => Programa, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_programa' })
  programa: Programa;

  // Llave foránea: periodo en el que se imparte
  @Column({ type: 'int', nullable: false })
  id_periodo: number;

  // Relación muchos a uno: en un periodo se dictan muchos grupos
  @ManyToOne(() => PeriodoAcademico, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_periodo' })
  periodo: PeriodoAcademico;

  // Grupo habilitado (TRUE) o cerrado (FALSE)
  @Column({ type: 'boolean', default: true })
  estado: boolean;
}
