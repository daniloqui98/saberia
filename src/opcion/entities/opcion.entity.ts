import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Pregunta } from '../../pregunta/entities/pregunta.entity.js';

// Decorador @Entity define que esta clase es una entidad de base de datos
// El nombre de la tabla sigue el diccionario de datos: tbl_opcion
@Entity('tbl_opcion')
export class Opcion {
  // Clave primaria auto-incremental
  @PrimaryGeneratedColumn({ name: 'id_opcion' })
  id_opcion: number;

  // Llave foránea: pregunta a la que pertenece la opción
  @Column({ type: 'int', nullable: false })
  id_pregunta: number;

  // Relación muchos a uno: una pregunta tiene muchas opciones
  // RESTRICT impide borrar una pregunta que todavía tenga opciones
  @ManyToOne(() => Pregunta, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_pregunta' })
  pregunta: Pregunta;

  // Contenido de la alternativa de respuesta (máx. 500 caracteres)
  @Column({ type: 'varchar', length: 500, nullable: false })
  texto: string;

  // Indica si es la respuesta clave
  @Column({ type: 'boolean', default: false })
  es_correcta: boolean;

  // Explicación si el estudiante marca esta opción (opcional, máx. 500)
  @Column({ type: 'varchar', length: 500, nullable: true, default: null })
  retroalimentacion: string | null;

  // Posición sugerida de la opción (1 a 5)
  @Column({ type: 'int', default: 1 })
  orden: number;
}
