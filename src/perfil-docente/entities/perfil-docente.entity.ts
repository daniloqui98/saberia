import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity.js';

// Decorador @Entity define que esta clase es una entidad de base de datos
// El nombre de la tabla sigue el diccionario de datos: tbl_perfil_docente
@Entity('tbl_perfil_docente')
export class PerfilDocente {
  // Clave primaria auto-incremental
  @PrimaryGeneratedColumn({ name: 'id_docente' })
  id_docente: number;

  // Llave foránea única (UFK): usuario base del docente
  // El índice UNIQUE lo crea automáticamente @OneToOne (no hace falta unique: true)
  @Column({ type: 'int', nullable: false })
  id_usuario: number;

  // Relación uno a uno: un usuario tiene como máximo un perfil docente
  // RESTRICT impide borrar un usuario que tenga perfil docente
  @OneToOne(() => User, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_usuario' })
  usuario: User;

  // Disciplina o especialidad del docente (máx. 100 caracteres)
  @Column({ type: 'varchar', length: 100, nullable: false })
  area: string;

  // Tipo de contrato: Planta / Catedratico / Ocasional
  @Column({ type: 'varchar', length: 50, nullable: false })
  vinculacion: string;
}
