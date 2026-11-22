import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DesempenoCompetencia } from '../../desempeno-competencia/entities/desempeno-competencia.entity.js';
import { RecursoApoyo } from '../../recurso-apoyo/entities/recurso-apoyo.entity.js';

// Decorador @Entity define que esta clase es una entidad de base de datos
// El nombre de la tabla sigue el diccionario de datos: tbl_retroalimentacion
// Consejo para el estudiante a partir de su desempeño en una competencia
@Entity('tbl_retroalimentacion')
export class Retroalimentacion {
  // Clave primaria auto-incremental
  @PrimaryGeneratedColumn({ name: 'id_retro' })
  id_retro: number;

  // Llave foránea: desempeño que origina el consejo
  @Column({ type: 'int', nullable: false })
  id_desempeno: number;

  // Relación muchos a uno: un desempeño puede tener varias retroalimentaciones
  // RESTRICT impide borrar un desempeño que tenga retroalimentaciones
  @ManyToOne(() => DesempenoCompetencia, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_desempeno' })
  desempeno: DesempenoCompetencia;

  // Llave foránea opcional: material de estudio sugerido
  @Column({ type: 'int', nullable: true, default: null })
  id_recurso: number | null;

  // Relación muchos a uno: un recurso se sugiere en muchas retroalimentaciones
  // RESTRICT impide borrar un recurso que esté sugerido
  @ManyToOne(() => RecursoApoyo, {
    nullable: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_recurso' })
  recurso: RecursoApoyo | null;

  // Descripción de la falencia o fortaleza
  @Column({ type: 'text', nullable: false })
  mensaje: string;

  // Acción de mejora a realizar (opcional)
  @Column({ type: 'text', nullable: true, default: null })
  recomendacion: string | null;

  // Quién la generó: Sistema / Docente
  @Column({ type: 'varchar', length: 30, default: 'Sistema' })
  origen: string;

  // Momento de emisión
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;
}
