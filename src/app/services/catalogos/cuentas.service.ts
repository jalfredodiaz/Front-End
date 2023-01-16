import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';



// Modelos
import { CuentaConMovimientosModel } from 'src/app/models/cuentas/cuenta-con-movimientos-model';
import { CuentaModel } from 'src/app/models/cuentas/cuenta-model';
import { RegistroGastosIngresosModel } from 'src/app/models/cuentas/registro-gastos-ingresos-model';

// Servicios
import { UtileriasService } from '../utilerias/utilerias.service';


@Injectable({
  providedIn: 'root'
})
export class CuentasService {
  private urlApi: string;

  constructor(private http: HttpClient,
              private utilerias: UtileriasService) {
    this.urlApi = `${environment.urlApi}Cuentas/`;
  }

  obtenerCuentas() {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');

    return this.http.get<CuentaModel[]>(this.urlApi + 'ObtenerListadoCuentas', { headers });
  }

  obtenerRegistroGastosIngresosPorCuenta(idCuenta: number, esIngreso: boolean) {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');
    const params = new HttpParams().set('idCuenta', idCuenta)
      .set('esIngreso', esIngreso);

    return this.http.get<RegistroGastosIngresosModel[]>(this.urlApi + 'ObtenerListadoMovimientosPorCuenta', { headers, params });
  }

  obtenerMovimientosCuentas(idCuenta: number, fechaIni: Date, fechaFin: Date) {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');

    const body = {
      idCuenta: idCuenta,
      fechaIni: this.utilerias.formatearFecha(fechaIni),
      fechaFin: this.utilerias.formatearFecha(fechaFin)
    };

    return this.http.post<CuentaConMovimientosModel>(this.urlApi + 'ObtenerSaldoCuenta', body, { headers });
  }

  guardarRegistroIngresoGastos(datos: RegistroGastosIngresosModel) {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');

    return this.http.post<number>(this.urlApi + 'RegistrarGastoIngreso', datos, { headers });
  }

  cancelarRegistroIngresoGastos(idMovimiento: number, observaciones: string) {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');

    const body = {
      IdMovimiento: idMovimiento,
      Observaciones: observaciones
    };

    return this.http.post<number>(this.urlApi + 'CancelarGastoIngreso', body, { headers });
  }

  guardarArchivo(archivo: Blob, idMovimiento: number) {
    const formData = new FormData();
    const params = new HttpParams()
      .set('idMovimiento', idMovimiento);

    formData.append('file', archivo);

    const req = new HttpRequest('POST', this.urlApi + 'GuardarArchivo', formData, { params: params, reportProgress: true });

    return this.http.request<string>(req);
  }

  borrarArchivo(idMovimiento: number, nombreArchivo: string) {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');
    const params = new HttpParams()
      .set('idMovimiento', idMovimiento)
      .set('nombreArchivo', nombreArchivo);

    return this.http.post(this.urlApi + 'BorrarArchivo', null, { headers, params });
  }
}
