import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Exclude } from 'class-transformer';
import { Programa } from '../../programa/entities/programa.entity.js';
import { Rol } from '../../rol/entities/rol.entity.js';

// Decorador @Entity define que esta clase es una entidad de base de datos
// El nombre de la tabla sigue el diccionario de datos: tbl_usuario
@Entity('tbl_usuario')
export class User {
  // Clave primaria auto-incremental
  @PrimaryGeneratedColumn({ name: 'id_usuario' })
  id_usuario: number;

  // Abreviatura del tipo de documento: CC / TI / CE / PAS
  @Column({ type: 'varchar', length: 5, default: 'CC' })
  tipo_documento: string;

  // Número de identificación personal (único, máx. 20 caracteres)
  @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
  num_documento: string;

  // Nombres completos del usuario (máx. 100 caracteres)
  @Column({ type: 'varchar', length: 100, nullable: false })
  nombres: string;

  // Apellidos completos del usuario (máx. 100 caracteres)
  @Column({ type: 'varchar', length: 100, nullable: false })
  apellidos: string;

  // Correo de acceso y notificaciones (único, máx. 120 caracteres)
  @Column({ type: 'varchar', length: 120, unique: true, nullable: false })
  correo: string;

  // Contraseña encriptada con bcrypt (nunca texto plano)
  // select: false evita que se devuelva por defecto en las consultas
  @Exclude()
  @Column({ type: 'varchar', length: 255, nullable: false, select: false })
  contrasena_hash: string;

  // Llave foránea opcional: programa base del usuario (NULL para admins)
  @Column({ type: 'int', nullable: true, default: null })
  id_programa: number | null;

  // Relación muchos a uno: muchos usuarios pertenecen a un programa
  // RESTRICT impide borrar un programa que todavía tenga usuarios
  @ManyToOne(() => Programa, {
    nullable: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_programa' })
  programa: Programa | null;

  // Bandera que indica si el usuario está activo
  @Column({ type: 'boolean', default: true })
  estado: boolean;

  // Fecha de creación automática (campo de auditoría)
  @CreateDateColumn({ type: 'timestamp' })
  fecha_registro: Date;

  // Inicio de sesión más reciente (se actualiza al hacer login)
  @Column({ type: 'timestamp', nullable: true, default: null })
  ultimo_acceso: Date | null;

  // Llave foránea: rol del usuario (cada usuario tiene un solo rol)
  @Column({ type: 'int', nullable: false })
  id_rol: number;

  // Relación muchos a uno: muchos usuarios tienen un mismo rol
  // RESTRICT impide borrar un rol que todavía tengan usuarios
  @ManyToOne(() => Rol, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_rol' })
  rol: Rol;
}
