import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { Grupo } from './entities/grupo.entity.js';
import { CreateGrupoDto } from './dto/create-grupo.dto.js';
import { UpdateGrupoDto } from './dto/update-grupo.dto.js';
import { PerfilDocenteService } from '../perfil-docente/perfil-docente.service.js';
import { ProgramaService } from '../programa/programa.service.js';
import { PeriodoAcademicoService } from '../periodo-academico/periodo-academico.service.js';

@Injectable()
export class GrupoService {
  constructor(
    @InjectRepository(Grupo)
    private readonly grupoRepository: Repository<Grupo>,
    // Servicios para validar que las 3 llaves foráneas existan
    private readonly perfilDocenteService: PerfilDocenteService,
    private readonly programaService: ProgramaService,
    private readonly periodoService: PeriodoAcademicoService,
  ) {}

  /**
   * Crear un nuevo grupo
   */
  async create(createGrupoDto: CreateGrupoDto): Promise<Grupo> {
    const existingGrupo = await this.grupoRepository.findOne({
      where: { codigo: createGrupoDto.codigo },
    });

    if (existingGrupo) {
      throw new ConflictException('El código del grupo ya está registrado');
    }

    // Cada una lanza 404 si el registro padre no existe
    const docente = await this.perfilDocenteService.findOne(
      createGrupoDto.id_docente,
    );
    const programa = await this.programaService.findOne(
      createGrupoDto.id_programa,
    );
    const periodo = await this.periodoService.findOne(createGrupoDto.id_periodo);

    const grupo = this.grupoRepository.create({
      ...createGrupoDto,
      docente,
      programa,
      periodo,
    });

    return await this.grupoRepository.save(grupo);
  }

  /**
   * Obtener todos los grupos (incluye docente, programa y periodo)
   */
  async findAll(): Promise<Grupo[]> {
    return await this.grupoRepository.find({
      relations: {
        docente: { usuario: true },
        programa: true,
        periodo: true,
      },
    });
  }

  /**
   * Obtener un grupo por ID (incluye docente, programa y periodo)
   */
  async findOne(id: number): Promise<Grupo> {
    const grupo = await this.grupoRepository.findOne({
      where: { id_grupo: id },
      relations: {
        docente: { usuario: true },
        programa: true,
        periodo: true,
      },
    });

    if (!grupo) {
      throw new NotFoundException(`Grupo con ID ${id} no encontrado`);
    }

    return grupo;
  }

  /**
   * Actualizar un grupo
   */
  async update(id: number, updateGrupoDto: UpdateGrupoDto): Promise<Grupo> {
    const grupo = await this.findOne(id);

    // Si cambia el código, verificar que no lo tenga otro grupo
    if (updateGrupoDto.codigo && updateGrupoDto.codigo !== grupo.codigo) {
      const existingGrupo = await this.grupoRepository.findOne({
        where: { codigo: updateGrupoDto.codigo },
      });

      if (existingGrupo) {
        throw new ConflictException('El código del grupo ya está registrado');
      }
    }

    Object.assign(grupo, updateGrupoDto);

    // Si cambia alguna llave foránea, validar que exista y actualizar la relación
    if (updateGrupoDto.id_docente) {
      grupo.docente = await this.perfilDocenteService.findOne(
        updateGrupoDto.id_docente,
      );
    }
    if (updateGrupoDto.id_programa) {
      grupo.programa = await this.programaService.findOne(
        updateGrupoDto.id_programa,
      );
    }
    if (updateGrupoDto.id_periodo) {
      grupo.periodo = await this.periodoService.findOne(
        updateGrupoDto.id_periodo,
      );
    }

    return await this.grupoRepository.save(grupo);
  }

  /**
   * Eliminar un grupo
   */
  async remove(id: number): Promise<void> {
    const grupo = await this.findOne(id);

    try {
      await this.grupoRepository.remove(grupo);
    } catch (error) {
      // 1451 = ER_ROW_IS_REFERENCED_2: hay estudiantes u otros registros en este grupo
      if (error instanceof QueryFailedError && error.driverError?.errno === 1451) {
        throw new ConflictException(
          'No se puede eliminar el grupo porque tiene registros asociados',
        );
      }
      throw error;
    }
  }
}
