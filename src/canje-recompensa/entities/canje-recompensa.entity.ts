import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PerfilEstudiante } from '../../perfil-estudiante/entities/perfil-estudiante.entity.js';
import { CatalogoRecompensa } from '../../catalogo-recompensa/entities/catalogo-recompensa.entity.js';

// Decorador @Entity define que esta clase es una entidad de base de datos
// El nombre de la tabla sigue el diccionario de datos: tbl_canje_recompensa
// Compra virtual de una recompensa con puntos de gamificación
@Entity('tbl_canje_recompensa')
export class CanjeRecompensa {
  // Clave primaria auto-incremental
  @PrimaryGeneratedColumn({ name: 'id_canje' })
  id_canje: number;

  // Llave foránea: estudiante que reclama
  @Column({ type: 'int', nullable: false })
  id_perfil: number;

  // Relación muchos a uno: un estudiante hace muchos canjes
  // RESTRICT impide borrar un perfil que tenga canjes
  @ManyToOne(() => PerfilEstudiante, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_perfil' })
  perfil: PerfilEstudiante;

  // Llave foránea: artículo o beneficio redimido
  @Column({ type: 'int', nullable: false })
  id_item: number;

  // Relación muchos a uno: una recompensa se canjea muchas veces
  // RESTRICT impide borrar del catálogo una recompensa ya canjeada
  @ManyToOne(() => CatalogoRecompensa, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_item' })
  item: CatalogoRecompensa;

  // Congela el costo de la recompensa al momento del canje (> 0)
  @Column({ type: 'int', nullable: false })
  puntos_gastados: number;

  // Estado de la entrega: Pendiente / Entregado / Anulado
  @Column({ type: 'varchar', length: 30, default: 'Pendiente' })
  estado: string;

  // Momento de la redención
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_canje: Date;
}
