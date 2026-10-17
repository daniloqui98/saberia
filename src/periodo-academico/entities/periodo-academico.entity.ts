import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Decorador @Entity define que esta clase es una entidad de base de datos
// El nombre de la tabla sigue el diccionario de datos: tbl_periodo_academico
@Entity('tbl_periodo_academico')
export class PeriodoAcademico {
  // Clave primaria auto-incremental
  @PrimaryGeneratedColumn({ name: 'id_periodo' })
  id_periodo: number;

  // Nombre corto institucional del periodo (único, máx. 10 caracteres)
  @Column({ type: 'varchar', length: 10, unique: true, nullable: false })
  codigo: string;

  // Inicio de clases del periodo (formato YYYY-MM-DD)
  @Column({ type: 'date', nullable: false })
  fecha_inicio: string;

  // Fin de clases del periodo (formato YYYY-MM-DD)
  @Column({ type: 'date', nullable: false })
  fecha_fin: string;

  // Indica si es el periodo en curso (solo uno puede estar activo)
  @Column({ type: 'boolean', default: false })
  activo: boolean;
}
