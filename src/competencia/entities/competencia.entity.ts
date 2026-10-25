import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Modulo } from '../../modulo/entities/modulo.entity.js';

// Decorador @Entity define que esta clase es una entidad de base de datos
// El nombre de la tabla sigue el diccionario de datos: tbl_competencia
@Entity('tbl_competencia')
export class Competencia {
  // Clave primaria auto-incremental
  @PrimaryGeneratedColumn({ name: 'id_competencia' })
  id_competencia: number;

  // Llave foránea: módulo al que pertenece la competencia
  @Column({ type: 'int', nullable: false })
  id_modulo: number;

  // Relación muchos a uno: muchas competencias pertenecen a un módulo
  // RESTRICT impide borrar un módulo que todavía tenga competencias
  @ManyToOne(() => Modulo, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_modulo' })
  modulo: Modulo;

  // Identificador corto de la competencia (único, máx. 20 caracteres)
  @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
  codigo: string;

  // Nombre de la habilidad a evaluar (máx. 200 caracteres)
  @Column({ type: 'varchar', length: 200, nullable: false })
  nombre: string;

  // Detalle ampliado de la competencia (opcional, máx. 500 caracteres)
  @Column({ type: 'varchar', length: 500, nullable: true, default: null })
  descripcion: string | null;

  // Vigencia de la competencia
  @Column({ type: 'boolean', default: true })
  activo: boolean;
}
