export class DepartamentoModel {
  nIdDepartamento: number;
  cDepartamento: string;
  bActivo: boolean;
  cUsuario_Registro: string;
  dFecha_Registro: Date;
  cUsuario_UltimaModificacion: string;
  dFecha_UltimaModificacion: Date;
  cUsuario_Eliminacion: string;
  dFecha_Eliminacion?: Date;
}
