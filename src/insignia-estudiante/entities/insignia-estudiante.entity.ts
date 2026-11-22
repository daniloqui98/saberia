import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { PerfilEstudiante } from '../../perfil-estudiante/entities/perfil-estudiante.entity.js';
import { CatalogoInsignia } from '../../catalogo-insignia/entities/catalogo-insignia.entity.js';

// Decorador @Entity define que esta clase es una entidad de base de datos
// El nombre de la tabla sigue el diccionario de datos: tbl_insignia_estudiante
// Regla: un estudiante gana cada insignia una sola vez
@Entity('tbl_insignia_estudiante')
@Unique('UQ_insignia_perfil_badge', ['id_perfil', 'id_badge'])
export class InsigniaEstudiante {
  // Clave primaria auto-incremental
  @PrimaryGeneratedColumn({ name: 'id_insignia' })
  id_insignia: number;

  // Llave foránea: estudiante ganador
  @Column({ type: 'int', nullable: false })
  id_perfil: number;

  // Relación muchos a uno: un estudiante gana muchas insignias
  // RESTRICT impide borrar un perfil que tenga insignias
  @ManyToOne(() => PerfilEstudiante, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_perfil' })
  perfil: PerfilEstudiante;

  // Llave foránea: logro desbloqueado (del catálogo de insignias)
  @Column({ type: 'int', nullable: false })
  id_badge: number;

  // Relación muchos a uno: una insignia la ganan muchos estudiantes
  // RESTRICT impide borrar del catálogo una insignia ya otorgada
  @ManyToOne(() => CatalogoInsignia, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_badge' })
  badge: CatalogoInsignia;

  // Momento exacto de la adjudicación
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_obtenida: Date;
}
