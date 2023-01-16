export class SolicitudPrestamoHistModel {
  IdPrestamo: number;
  IdRubro: number;
  NombreRubro: string;
  Importe: number;
  FechaCobro: Date;
  FechaRegistro: Date;
  Pagado: boolean;
  // dFecha_Registro: Date = new Date();
  // cRutaArchivoINE_Frente: string = '';
  // cRutaArchivoINE_Atras: string = '';
  // cRutaPagare: string = '';
  // cRutaCheque: string = '';
  Activo: boolean = true;
}
