import * as moment from "moment";
import 'moment/locale/es-mx';
import { SolicitudPrestamoModel } from "../solicitud-prestamo/solicitud-prestamo-model";

export class CortePrestamoModel {
  nIdCorte: number;
  nIdRubro: number;
  NombreRubro: string;
  dFechaCorte: Date = moment().toDate();
  dFecha_Registro: Date = moment().toDate();
  nTotal: number = 0;
  bActivo: boolean = true;
  bPagado: boolean = false;
  Nuevo: boolean = true;
  nVersion: number;
  Prestamos: SolicitudPrestamoModel[] = [];
  imprimiendo: boolean = false;
}
