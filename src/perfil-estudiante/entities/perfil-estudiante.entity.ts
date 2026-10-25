import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity.js';
import { Grupo } from '../../grupo/entities/grupo.entity.js';

// Decorador @Entity define que esta clase es una entidad de base de datos
// El nombre de la tabla sigue el diccionario de datos: tbl_perfil_estudiante
// Los campos marcados (*) son atributos derivados (desnormalización controlada)
@Entity('tbl_perfil_estudiante')
export class PerfilEstudiante {
  // Clave primaria auto-incremental
  @PrimaryGeneratedColumn({ name: 'id_perfil' })
  id_perfil: number;

  // Llave foránea única (UFK): usuario base del estudiante
  // El índice UNIQUE lo crea automáticamente @OneToOne
  @Column({ type: 'int', nullable: false })
  id_usuario: number;

  // Relación uno a uno: un usuario tiene como máximo un perfil estudiante
  // RESTRICT impide borrar un usuario que tenga perfil estudiante
  @OneToOne(() => User, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_usuario' })
  usuario: User;

  // Llave foránea opcional: grupo del estudiante (cada estudiante está en un
  // solo grupo). NULL mientras no se le asigne grupo
  @Column({ type: 'int', nullable: true, default: null })
  id_grupo: number | null;

  // Relación muchos a uno: un grupo tiene muchos estudiantes
  // RESTRICT impide borrar un grupo que todavía tenga estudiantes
  @ManyToOne(() => Grupo, {
    nullable: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_grupo' })
  grupo: Grupo | null;

  // Semestre que cursa actualmente (1 al 12)
  @Column({ type: 'int', nullable: false })
  semestre: number;

  // (*) Calificación global consolidada (0.00 - 300.00)
  // DECIMAL(5,2): 5 dígitos en total, 2 decimales -> máximo 999.99
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
  nivel_global: number | null;

  // (*) Saldo de gamificación acumulado
  @Column({ type: 'int', default: 0 })
  puntos_totales: number;

  // (*) Días consecutivos usando el simulador
  @Column({ type: 'int', default: 0 })
  racha_actual: number;

  // (*) Máximo histórico de días consecutivos
  @Column({ type: 'int', default: 0 })
  racha_maxima: number;

  // Última vez que se recalcularon los derivados (se actualiza sola al guardar)
  @UpdateDateColumn({ type: 'timestamp' })
  fecha_actualizacion: Date;
}
