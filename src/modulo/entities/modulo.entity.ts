import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Decorador @Entity define que esta clase es una entidad de base de datos
// El nombre de la tabla sigue el diccionario de datos: tbl_modulo
@Entity('tbl_modulo')
export class Modulo {
  // Clave primaria auto-incremental
  @PrimaryGeneratedColumn({ name: 'id_modulo' })
  id_modulo: number;

  // Código oficial del módulo ante el ICFES (único, máx. 20 caracteres)
  @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
  codigo: string;

  // Nombre descriptivo del módulo (máx. 150 caracteres)
  @Column({ type: 'varchar', length: 150, nullable: false })
  nombre: string;

  // Explicación del propósito del módulo (opcional, máx. 500 caracteres)
  @Column({ type: 'varchar', length: 500, nullable: true, default: null })
  descripcion: string | null;

  // Clasificación del área evaluada: Generico / Especifico
  @Column({ type: 'varchar', length: 30, default: 'Generico' })
  tipo: string;

  // Indica si el módulo está vigente
  @Column({ type: 'boolean', default: true })
  activo: boolean;
}
