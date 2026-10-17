import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Decorador @Entity define que esta clase es una entidad de base de datos
// El nombre de la tabla sigue el diccionario de datos: tbl_catalogo_recompensa
@Entity('tbl_catalogo_recompensa')
export class CatalogoRecompensa {
  // Clave primaria auto-incremental
  @PrimaryGeneratedColumn({ name: 'id_item' })
  id_item: number;

  // Título del premio (máx. 100 caracteres)
  @Column({ type: 'varchar', length: 100, nullable: false })
  nombre: string;

  // Detalle visual o físico del item (opcional, máx. 255 caracteres)
  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  descripcion: string | null;

  // Valor a descontar del saldo de puntos del estudiante
  @Column({ type: 'int', default: 100 })
  costo_puntos: number;

  // Cantidades disponibles del premio (0 = Agotado)
  @Column({ type: 'int', default: 0 })
  stock: number;

  // Bandera de visibilidad en la tienda
  @Column({ type: 'boolean', default: true })
  activo: boolean;
}
