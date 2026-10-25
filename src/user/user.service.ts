import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { ProgramaService } from '../programa/programa.service.js';
import { RolService } from '../rol/rol.service.js';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    // Servicios de Programa y Rol para validar que las llaves foráneas existan
    private readonly programaService: ProgramaService,
    private readonly rolService: RolService,
  ) {}

  /**
   * Crear un nuevo usuario
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { contrasena, ...datos } = createUserDto;

    const existingCorreo = await this.userRepository.findOne({
      where: { correo: datos.correo },
    });

    if (existingCorreo) {
      throw new ConflictException('El correo ya está registrado');
    }

    const existingDocumento = await this.userRepository.findOne({
      where: { num_documento: datos.num_documento },
    });

    if (existingDocumento) {
      throw new ConflictException('El número de documento ya está registrado');
    }

    // Lanza 404 si el programa no existe (solo si se envió)
    const programa = datos.id_programa
      ? await this.programaService.findOne(datos.id_programa)
      : null;

    // Lanza 404 si el rol no existe. Si no se envía, se asigna ESTUDIANTE
    const rol = datos.id_rol
      ? await this.rolService.findOne(datos.id_rol)
      : await this.rolService.findByNombre('ESTUDIANTE');

    const contrasenaHash = await bcrypt.hash(contrasena, 10);

    const user = this.userRepository.create({
      ...datos,
      programa,
      id_rol: rol.id_rol,
      rol,
      contrasena_hash: contrasenaHash,
    });

    return await this.userRepository.save(user);
  }

  /**
   * Obtener todos los usuarios (incluye los datos de su programa)
   */
  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      relations: { programa: true, rol: true },
    });
  }

  /**
   * Obtener un usuario por ID (incluye los datos de su programa)
   */
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id_usuario: id },
      relations: { programa: true, rol: true },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  /**
   * Buscar usuario por ID para autenticación
   */
  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id_usuario: id },
      relations: { rol: true },
    });
  }

  /**
   * Buscar usuario por correo
   * Incluye la contraseña encriptada para autenticación
   */
  async findOneByCorreo(correo: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { correo },
      select: {
        id_usuario: true,
        correo: true,
        contrasena_hash: true,
        nombres: true,
        apellidos: true,
        estado: true,
        id_rol: true,
        rol: { id_rol: true, nombre: true },
      },
      relations: { rol: true },
    });
  }

  /**
   * Registrar la fecha del inicio de sesión más reciente
   */
  async registrarAcceso(id: number): Promise<void> {
    await this.userRepository.update(
      { id_usuario: id },
      { ultimo_acceso: new Date() },
    );
  }

  /**
   * Actualizar un usuario
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    const { contrasena, ...datos } = updateUserDto;

    // Si cambia el correo, verificar que no lo tenga otro usuario
    if (datos.correo && datos.correo !== user.correo) {
      const existingCorreo = await this.userRepository.findOne({
        where: { correo: datos.correo },
      });

      if (existingCorreo) {
        throw new ConflictException('El correo ya está registrado');
      }
    }

    // Si cambia el documento, verificar que no lo tenga otro usuario
    if (datos.num_documento && datos.num_documento !== user.num_documento) {
      const existingDocumento = await this.userRepository.findOne({
        where: { num_documento: datos.num_documento },
      });

      if (existingDocumento) {
        throw new ConflictException(
          'El número de documento ya está registrado',
        );
      }
    }

    Object.assign(user, datos);

    // Si cambia el programa, validar que exista y actualizar la relación
    if (datos.id_programa) {
      user.programa = await this.programaService.findOne(datos.id_programa);
    }

    // Si cambia el rol, validar que exista y actualizar la relación
    if (datos.id_rol) {
      user.rol = await this.rolService.findOne(datos.id_rol);
    }

    if (contrasena) {
      user.contrasena_hash = await bcrypt.hash(contrasena, 10);
    }

    return await this.userRepository.save(user);
  }

  /**
   * Eliminar un usuario
   */
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);

    try {
      await this.userRepository.remove(user);
    } catch (error) {
      // 1451 = ER_ROW_IS_REFERENCED_2: hay registros (ej: log) que apuntan a este usuario
      if (error instanceof QueryFailedError && error.driverError?.errno === 1451) {
        throw new ConflictException(
          'No se puede eliminar el usuario porque tiene registros asociados',
        );
      }
      throw error;
    }
  }
}
