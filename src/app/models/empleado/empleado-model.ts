import { EmpleadoArchivosModel } from "./empleado-archivos-model";

export class EmpleadoModel {
  nCodEmpleado: number;
  cNombre: string;
  nIdPuesto: number;
  dFechaIngreso: Date;
  bActivo: boolean;
  cPuesto: string;
  cDepartamento: string;
  nIdDepartamento: number;
  nSueldo: number;
  nEstatusCrecimiento: number;
  cObservaciones: string;
  Archivos: EmpleadoArchivosModel[] = [];
  // cUsuario_Registro: string;
  // dFecha_Registro: Date;
  // cUsuario_UltimaModificacion: string;
  // dFecha_UltimaModificacion?: Date;
  // cUsuario_Eliminacion: string;
  // dFecha_Eliminacion?: Date;
}
