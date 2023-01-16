import { formatDate } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import * as moment from 'moment';
import { CortePrestamoModel } from 'src/app/models/corte-prestamo/corte-prestamo-model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CortePrestamoService {
  private urlApi: string;

  constructor(private http: HttpClient) {
    this.urlApi = `${environment.urlApi}CortePrestamo/`;
  }

  obtenerListado() {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');

    return this.http.get<CortePrestamoModel[]>(this.urlApi + 'ObtenerCortePrestamoListado', { headers });
  }

  obtenerListadoFiltrado(fechaIni: Date, fechaFin: Date, estatusCorte: number, idRubro: number) {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');
    const params = new HttpParams()
      .set('fechaIni', formatDate(fechaIni, 'yyyy-MM-dd', 'en-MX'))
      .set('fechaFin', formatDate(fechaFin, 'yyyy-MM-dd', 'en-MX'))
      .set('estatusCorte', estatusCorte)
      .set('idRubro', idRubro);

    return this.http.get<CortePrestamoModel[]>(this.urlApi + 'ObtenerCortePrestamoListadoFiltrado', { headers, params });
  }

  obtenerPDF(idCortePrestamo: number) {
    const params = new HttpParams()
      .set("idCorte", idCortePrestamo);
    const req = new HttpRequest('GET', this.urlApi + 'ObtenerPDFCortePrestamo', {
                                  params: params, reportProgress: false, responseType: 'blob'
                              });

    return this.http.request(req);
  }

  guardar(datos: CortePrestamoModel) {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');

    return this.http.post<number>(this.urlApi + 'GuardarCorte', datos, { headers });
  }

  modificar(datos: CortePrestamoModel) {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');

    return this.http.post(this.urlApi + 'ModificarSolicitudPrestamo', datos, { headers });
  }

  cancelar(idCorte: number, version: number) {

    console.log('idCorte', idCorte);
    console.log('version', version);

    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');
    const params = new HttpParams()
      .set('idCorte', idCorte)
      .set('version', version);

    return this.http.post(this.urlApi + 'CancelarCorte', null, { headers, params });
  }

  pagar(idCorte: number, version: number) {

    console.log('idCorte', idCorte);
    console.log('version', version);

    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');
    const params = new HttpParams()
      .set('idCorte', idCorte)
      .set('version', version);

    return this.http.post(this.urlApi + 'PagarCorte', null, { headers, params });
  }

  cancelarPagar(idCorte: number, version: number) {

    console.log('idCorte', idCorte);
    console.log('version', version);

    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');
    const params = new HttpParams()
      .set('idCorte', idCorte)
      .set('version', version);

    return this.http.post(this.urlApi + 'CancelarPagoCorte', null, { headers, params });
  }
}
