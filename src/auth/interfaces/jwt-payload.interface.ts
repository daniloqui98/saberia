// Interfaz que define la estructura del payload del JWT
export interface JwtPayload {
  sub: number;      // ID del usuario (id_usuario)
  correo: string;   // Correo del usuario
  rol: string;      // Nombre del rol del usuario (tbl_rol)
}
