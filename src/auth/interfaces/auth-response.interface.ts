export interface AuthResponse {
  user: {
    id_usuario: number;
    correo: string;
    nombres: string;
    apellidos: string;
    rol: string;
  };
  token: string;
}
