import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PerfilEstudiante } from '../../perfil-estudiante/entities/perfil-estudiante.entity.js';
import { Simulacro } from '../../simulacro/entities/simulacro.entity.js';
import { AsignacionSimulacro } from '../../asignacion-simulacro/entities/asignacion-simulacro.entity.js';

// Decorador @Entity define que esta clase es una entidad de base de datos
// El nombre de la tabla sigue el diccionario de datos: tbl_sesion_sim
// Cada fila es un intento de un estudiante en un simulacro
@Entity('tbl_sesion_sim')
export class SesionSim {
  // Clave primaria auto-incremental
  @PrimaryGeneratedColumn({ name: 'id_sesion' })
  id_sesion: number;

  // Llave foránea: estudiante que realiza el intento
  @Column({ type: 'int', nullable: false })
  id_perfil: number;

  // Relación muchos a uno: un estudiante tiene muchos intentos
  @ManyToOne(() => PerfilEstudiante, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_perfil' })
  perfil: PerfilEstudiante;

  // Llave foránea: prueba que está rindiendo
  @Column({ type: 'int', nullable: false })
  id_simulacro: number;

  // Relación muchos a uno: un simulacro se presenta muchas veces
  @ManyToOne(() => Simulacro, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_simulacro' })
  simulacro: Simulacro;

  // Llave foránea opcional: asignación que autorizó el intento (NULL si es libre)
  @Column({ type: 'int', nullable: true, default: null })
  id_asignacion: number | null;

  // Relación muchos a uno: una asignación genera muchos intentos
  @ManyToOne(() => AsignacionSimulacro, {
    nullable: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_asignacion' })
  asignacion: AsignacionSimulacro | null;

  // Secuencia del intento (1, 2, 3...), la calcula el sistema
  @Column({ type: 'int', default: 1 })
  intento_num: number;

  // Momento exacto de arranque (se llena solo)
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_inicio: Date;

  // Momento de entrega o fin de tiempo (NULL mientras está en curso)
  @Column({ type: 'timestamp', nullable: true, default: null })
  fecha_fin: Date | null;

  // Condición actual: En curso / Finalizado / Abandonado
  @Column({ type: 'varchar', length: 20, default: 'En curso' })
  estado: string;

  // Calificación final de la sesión
  // El transformer convierte el texto que devuelve MySQL en número
  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
    default: 0,
    transformer: {
      to: (value: number | null) => value,
      from: (value: string | null) => (value === null ? null : Number(value)),
    },
  })
  puntaje_total: number | null;

  // Total de segundos invertidos (se calcula al terminar)
  @Column({ type: 'int', nullable: true, default: 0 })
  tiempo_total_seg: number | null;
}
