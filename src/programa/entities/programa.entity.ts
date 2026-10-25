import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Facultad } from '../../facultad/entities/facultad.entity.js';

// Decorador @Entity define que esta clase es una entidad de base de datos
// El nombre de la tabla sigue el diccionario de datos: tbl_programa
@Entity('tbl_programa')
export class Programa {
  // Clave primaria auto-incremental
  @PrimaryGeneratedColumn({ name: 'id_programa' })
  id_programa: number;

  // Llave foránea: facultad a la que pertenece el programa
  @Column({ type: 'int', nullable: false })
  id_facultad: number;

  // Relación muchos a uno: muchos programas pertenecen a una facultad
  // RESTRICT impide borrar una facultad que todavía tenga programas
  @ManyToOne(() => Facultad, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_facultad' })
  facultad: Facultad;

  // Código SNIES o interno del programa (único, máx. 15 caracteres)
  @Column({ type: 'varchar', length: 15, unique: true, nullable: false })
  codigo: string;

  // Nombre del programa académico (máx. 150 caracteres)
  @Column({ type: 'varchar', length: 150, nullable: false })
  nombre: string;

  // Nivel de formación: Pregrado / Posgrado / Diplomado
  @Column({ type: 'varchar', length: 30, default: 'Pregrado' })
  nivel: string;
}
