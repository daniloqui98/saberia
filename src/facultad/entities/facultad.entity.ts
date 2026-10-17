import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Decorador @Entity define que esta clase es una entidad de base de datos
// El nombre de la tabla sigue el diccionario de datos: tbl_facultad
@Entity('tbl_facultad')
export class Facultad {
  // Clave primaria auto-incremental
  @PrimaryGeneratedColumn({ name: 'id_facultad' })
  id_facultad: number;

  // Código institucional de la facultad (único, máx. 10 caracteres)
  @Column({ type: 'varchar', length: 10, unique: true, nullable: false })
  codigo: string;

  // Nombre oficial de la facultad (máx. 100 caracteres)
  @Column({ type: 'varchar', length: 100, nullable: false })
  nombre: string;
}
