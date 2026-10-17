import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Decorador @Entity define que esta clase es una entidad de base de datos
// El nombre de la tabla sigue el diccionario de datos: tbl_rol
@Entity('tbl_rol')
export class Rol {
  // Clave primaria auto-incremental
  @PrimaryGeneratedColumn({ name: 'id_rol' })
  id_rol: number;

  // Nombre corto del rol (único, sin espacios, máx. 50 caracteres)
  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  nombre: string;

  // Detalle de los permisos del rol (opcional, máx. 150 caracteres)
  @Column({ type: 'varchar', length: 150, nullable: true, default: null })
  descripcion: string | null;
}
