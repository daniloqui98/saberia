import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Decorador @Entity define que esta clase es una entidad de base de datos
// El nombre de la tabla sigue el diccionario de datos: tbl_catalogo_insignia
@Entity('tbl_catalogo_insignia')
export class CatalogoInsignia {
  // Clave primaria auto-incremental
  @PrimaryGeneratedColumn({ name: 'id_badge' })
  id_badge: number;

  // Identificador corto del badge (único, máx. 20 caracteres)
  @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
  codigo: string;

  // Título comercial de la insignia (máx. 100 caracteres)
  @Column({ type: 'varchar', length: 100, nullable: false })
  nombre: string;

  // Explicación para los estudiantes (opcional, máx. 300 caracteres)
  @Column({ type: 'varchar', length: 300, nullable: true, default: null })
  descripcion: string | null;

  // Ruta o URL de la imagen ilustrativa (máx. 255 caracteres)
  @Column({ type: 'varchar', length: 255, nullable: false })
  icono: string;

  // Regla del sistema que dispara el logro (máx. 100 caracteres)
  @Column({ type: 'varchar', length: 100, nullable: false })
  criterio: string;

  // Puntos extra que recibe el estudiante al ganar el badge
  @Column({ type: 'int', default: 0 })
  puntos_bonus: number;
}
