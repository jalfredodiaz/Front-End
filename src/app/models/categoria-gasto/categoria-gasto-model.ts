export class CategoriaGastoModel {
  nIdCategoria: number = 0;
  cCategoria: string;
  bActivo: boolean;
  cUsuario_Registro: string;
  dFecha_Registro: Date;
  cMaquina_Registro: string;
  cUsuario_UltimaModificacion: string;
  dFecha_UltimaModificacion: Date;
  cMaquina_UltimaModificacion: string;
  cUsuario_Eliminacion: string;
  dFecha_Eliminacion?: Date;
  cMaquina_Eliminacion: string;
}
