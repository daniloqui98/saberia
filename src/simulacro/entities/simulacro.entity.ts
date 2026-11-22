import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity.js';
import { Modulo } from '../../modulo/entities/modulo.entity.js';

// Decorador @Entity define que esta clase es una entidad de base de datos
// El nombre de la tabla sigue el diccionario de datos: tbl_simulacro
// Los campos marcados (*) son atributos derivados
@Entity('tbl_simulacro')
export class Simulacro {
  // Clave primaria auto-incremental
  @PrimaryGeneratedColumn({ name: 'id_simulacro' })
  id_simulacro: number;

  // Llave foránea: docente que diseñó el simulacro
  @Column({ type: 'int', nullable: false })
  id_creador: number;

  // Relación muchos a uno: un docente crea muchos simulacros
  // RESTRICT impide borrar un usuario que haya creado simulacros
  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_creador' })
  creador: User;

  // Llave foránea opcional: módulo Saber Pro que evalúa (NULL para mixtos)
  @Column({ type: 'int', nullable: true, default: null })
  id_modulo: number | null;

  // Relación muchos a uno: un módulo tiene muchos simulacros
  // RESTRICT impide borrar un módulo que tenga simulacros
  @ManyToOne(() => Modulo, {
    nullable: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_modulo' })
  modulo: Modulo | null;

  // Título del simulacro (máx. 150 caracteres)
  @Column({ type: 'varchar', length: 150, nullable: false })
  nombre: string;

  // Instrucciones o propósito (opcional, máx. 500 caracteres)
  @Column({ type: 'varchar', length: 500, nullable: true, default: null })
  descripcion: string | null;

  // Naturaleza de la prueba: Diagnostico / Entrenamiento / Final
  @Column({ type: 'varchar', length: 50, default: 'Entrenamiento' })
  tipo: string;

  // Tiempo límite en minutos (10 a 300)
  @Column({ type: 'int', default: 60 })
  duracion_min: number;

  // (*) Cantidad de preguntas del simulacro (se calcula desde tbl_sim_pregunta)
  @Column({ type: 'int', default: 0 })
  total_preguntas: number;

  // Nivel de acceso: Publico / Privado / Protegido
  @Column({ type: 'varchar', length: 30, default: 'Privado' })
  visibilidad: string;

  // Disponibilidad de la prueba
  @Column({ type: 'boolean', default: true })
  estado: boolean;

  // Cuándo se registró el simulacro (se llena solo)
  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;
}
