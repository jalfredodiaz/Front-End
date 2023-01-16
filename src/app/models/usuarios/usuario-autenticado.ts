import { OpcionMenuModel } from "./OpcionesMenu";

export class UsuarioAutenticado {
  Login: string;
  Nombre: string;
  NombreCorto: string;
  Email: string;
  Rol: string;
  Token: string;
  Hombre: boolean;
  FechaExpiracion: Date;
  Foto: string;
}
