import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Afirmacion } from '../../afirmacion/entities/afirmacion.entity.js';

// Decorador @Entity define que esta clase es una entidad de base de datos
// El nombre de la tabla sigue el diccionario de datos: tbl_evidencia
@Entity('tbl_evidencia')
export class Evidencia {
  // Clave primaria auto-incremental
  @PrimaryGeneratedColumn({ name: 'id_evidencia' })
  id_evidencia: number;

  // Llave foránea: afirmación a la que tributa la evidencia
  @Column({ type: 'int', nullable: false })
  id_afirmacion: number;

  // Relación muchos a uno: una afirmación tiene muchas evidencias
  // RESTRICT impide borrar una afirmación que todavía tenga evidencias
  @ManyToOne(() => Afirmacion, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_afirmacion' })
  afirmacion: Afirmacion;

  // Referencia interna de la evidencia (opcional, no es única, máx. 20)
  @Column({ type: 'varchar', length: 20, nullable: true, default: null })
  codigo: string | null;

  // Acción observable esperada (máx. 400 caracteres)
  @Column({ type: 'varchar', length: 400, nullable: false })
  descripcion: string;

  // Vigencia de la evidencia
  @Column({ type: 'boolean', default: true })
  activo: boolean;
}
