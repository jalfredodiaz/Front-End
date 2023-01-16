export class SolicitudPrestamoModel {
  nIdPrestamo: number = 0;
  nCodEmpleado: number = 0;
  NombreEmpleado: string = '';
  nIdRubro: number = 0;
  NombreRubro: string = '';
  nImporte: number = 0;
  nSaldo: number = 0;
  dFechaCobro: Date | any = new Date();
  dFecha_Registro: Date | any = new Date();
  cRutaArchivoINE_Frente: string;
  cRutaArchivoINE_Atras: string;
  cRutaPagare: string;
  cRutaCheque: string;
  bRutaArchivoINE_Frente: Blob;
  bRutaArchivoINE_Atras: Blob;
  bRutaPagare: Blob;
  bRutaCheque: Blob;
  bActivo: boolean = true;
  bConCorte: boolean = false;
  GuardandoINE_Frente = false;
  GuardandoINE_Atras = false;
  GuardandoPagare = false;
  GuardandoCheque = false;
  nVersion: number = 0;
  Nueva: boolean = true;
}
