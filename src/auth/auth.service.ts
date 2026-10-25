import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserService } from '../user/user.service.js';
import { User } from '../user/entities/user.entity.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { JwtPayload } from './interfaces/jwt-payload.interface.js';
import { AuthResponse } from './interfaces/auth-response.interface.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const user: User = await this.userService.create(registerDto);

    return await this.buildAuthResponse(user);
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { correo, contrasena } = loginDto;

    const user: User | null =
      await this.userService.findOneByCorreo(correo);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid: boolean = await bcrypt.compare(
      contrasena,
      user.contrasena_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.estado) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    // Registrar la fecha del inicio de sesión (ultimo_acceso)
    await this.userService.registrarAcceso(user.id_usuario);

    return await this.buildAuthResponse(user);
  }

  async validateToken(token: string): Promise<User> {
    let payload: JwtPayload;

    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    const user: User | null =
      await this.userService.findById(payload.sub);

    if (!user || !user.estado) {
      throw new UnauthorizedException('Token inválido');
    }

    return user;
  }

  private async generateToken(user: User): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id_usuario,
      correo: user.correo,
      rol: user.rol.nombre,
    };

    return await this.jwtService.signAsync(payload);
  }

  private async buildAuthResponse(
    user: User,
  ): Promise<AuthResponse> {
    const token: string = await this.generateToken(user);

    return {
      user: {
        id_usuario: user.id_usuario,
        correo: user.correo,
        nombres: user.nombres,
        apellidos: user.apellidos,
        rol: user.rol.nombre,
      },
      token,
    };
  }
}