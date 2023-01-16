export class RegistroGastosIngresosModel {
  nIdMovimiento: number;
  nIdCuenta: number = 0;
  nIdTipoMovimiento: number = 0;
  NombreTipoMovimiento: string = '';
  nIdCategoria: number = 0;
  NombreCategoria: string = '';
  nIdMovimientoCancela: number = 0;
  dFecha_Registro: Date = new Date();
  nImporte: number = 0;
  cObservaciones: string = '';
  cRutaDocumento: string;
  bRutaDocumento: Blob;
  bActivo: boolean = true;
  Nuevo: boolean = true;
  Cancelado: boolean = false;
}
