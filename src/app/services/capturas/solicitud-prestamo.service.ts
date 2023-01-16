import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


// Modelos
import { SolicitudPrestamoModel } from 'src/app/models/solicitud-prestamo/solicitud-prestamo-model';
import { SolicitudPrestamoHistModel } from 'src/app/models/solicitud-prestamo/solicitud-prestamo-hist-model';
import { formatDate } from '@angular/common';
import { SolicitudPrestamoGuardarArchivoRespuestaModel } from 'src/app/models/solicitud-prestamo/solicitud-prestamo-guardar-archivo-respuesta-model';


// Servicios


@Injectable({
  providedIn: 'root'
})
export class SolicitudPrestamoService {
  private urlApi: string;

  constructor(private http: HttpClient) {
    this.urlApi = `${environment.urlApi}SolicitudPrestamo/`;
  }

  obtenerListado() {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');

    return this.http.get<SolicitudPrestamoModel[]>(this.urlApi + 'ObtenerSolicitudesDePrestamo', { headers });
  }

  obtenerListadoPorRubroFechaCorte(idRubro: number, fechaCorte: Date) {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');
    const params = new HttpParams()
      .set('idRubro', idRubro)
      .set('fechaCorte', formatDate(fechaCorte, 'yyyy-MM-dd', 'en-MX'));

    return this.http.get<SolicitudPrestamoModel[]>(this.urlApi + 'ObtenerSolicitudesDePrestamoPorFechaCorte', { headers, params });
  }

  obtenerListadoPorIdCorte(idCorte: number) {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');
    const params = new HttpParams()
      .set('idCorte', idCorte);

    return this.http.get<SolicitudPrestamoModel[]>(this.urlApi + 'ObtenerSolicitudesDePrestamoPorIdCorte', { headers, params });
  }

  obtenerHistorial(codigoEmpleado: number) {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');
    const params = new HttpParams()
      .set('codigoEmpleado', codigoEmpleado);

    return this.http.get<SolicitudPrestamoHistModel[]>(this.urlApi + 'ObtenerHistorial', { headers, params });
  }

  obtenerCreditoUtilizado(idSolicitud: number, codigoEmpleado: number, idRubro: number) {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');
    const params = new HttpParams()
      .set('idSolicitud', idSolicitud)
      .set('codigoEmpleado', codigoEmpleado)
      .set('idRubro', idRubro);

    return this.http.get<number>(this.urlApi + 'ObtenerCreditoUtilizado', { headers, params });
  }

  obtenerCreditoMaximo(codigoEmpleado: number, idRubro: number) {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');
    const params = new HttpParams()
      .set('codigoEmpleado', codigoEmpleado)
      .set('idRubro', idRubro);

    return this.http.get<number>(this.urlApi + 'ObtenerCreditoMaximo', { headers, params });
  }

  obtenerPDF(idPrestamo: number) {
    const params = new HttpParams()
      .set("idSolicitud", idPrestamo);
    const req = new HttpRequest('GET', this.urlApi + 'ObtenerPDFSolicitud', {
      params: params, reportProgress: false, responseType: 'blob'
    });

    return this.http.request(req);
  }

  guardar(datos: SolicitudPrestamoModel) {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');

    return this.http.post<number>(this.urlApi + 'GuardarSolicitudPrestamo', datos, { headers });
  }

  modificar(datos: SolicitudPrestamoModel){
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');

    return this.http.post(this.urlApi + 'ModificarSolicitudPrestamo', datos, { headers });
  }

  cancelar(idSolicitud: number, version: number) {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');
    const params = new HttpParams()
      .set('idSolicitud', idSolicitud)
      .set('version', version);

    return this.http.post(this.urlApi + 'CancelarSolicitudPrestamo', null, { headers, params });
  }

  guardarArchivo(archivo: Blob, idSolicitud: number, tipoArchivo: number) {
    const formData = new FormData();
    const params = new HttpParams()
      .set('idSolicitud', idSolicitud)
      .set('tipoArchivo', tipoArchivo);

    // console.log('params idSolicitud', idSolicitud);

    formData.append('file', archivo);
    // formData.append('idSolicitud', idSolicitud.toString());
    // formData.append('tipoArchivo', tipoArchivo.toString());

    const req = new HttpRequest('POST', this.urlApi + 'GuardarArchivo', formData, { params: params, reportProgress: true });

    return this.http.request<SolicitudPrestamoGuardarArchivoRespuestaModel>(req);
  }

  borrarArchivo(idSolicitud: number, nombreArchivo: string, tipoArchivo: number) {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');
    const params = new HttpParams()
      .set('idSolicitud', idSolicitud)
      .set('nombreArchivo', nombreArchivo)
      .set('tipoArchivo', tipoArchivo);

    return this.http.post<number>(this.urlApi + 'BorrarArchivo', null, { headers, params });
  }
}
