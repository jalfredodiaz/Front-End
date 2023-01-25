import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { of, Subscription, tap, timer } from 'rxjs';
import { EmpleadoArchivosModel } from 'src/app/models/empleado/empleado-archivos-model';
import { EmpleadoConSueldo } from 'src/app/models/empleado/empleado-con-sueldo';
import { EmpleadoModel } from 'src/app/models/empleado/empleado-model';
import { EscalonadoModel } from 'src/app/models/empleado/escalonado-model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService implements OnInit, OnDestroy  {
  private urlApi: string;
  // private empleados: EmpleadoModel[];

  // private subscripcionTimer: Subscription;

  constructor(private http: HttpClient) {
    this.urlApi = `${environment.urlApi}Empleados/`;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  obtenerListado() {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');

    return this.http.get<EmpleadoModel[]>(this.urlApi + 'ObtenerEmpleados', { headers });
  }

  obtenerEmpleadoConSueldo() {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');

    return this.http.get<EmpleadoConSueldo[]>(this.urlApi + 'ObtenerListadoConSueldo', { headers });
  }

  obtenerPorCodigo(codigo: number) {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');
    const params = new HttpParams()
      .set('codigo', codigo);

    return this.http.get<EmpleadoModel>(this.urlApi + 'ObtenerEmpleados', { headers, params });
  }

  obtenerEmpleadosSustitutos(codigoEmpleado: number) {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');
    const params = new HttpParams()
      .set('codigoEmpleado', codigoEmpleado);

    return this.http.get<EscalonadoModel[]>(this.urlApi + 'ObtenerEmpleadosSustitutos', { headers, params });
  }

  obtenerArchivos(codigoEmpleado: number) {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');
    const params = new HttpParams()
      .set('codigoEmpleado', codigoEmpleado);

    return this.http.get<EmpleadoArchivosModel[]>(this.urlApi + 'ObtenerArchivosEmpleado', { headers, params });
  }

  guardar(datos: EmpleadoModel) {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');

    return this.http.post<number>(this.urlApi + 'GuardarEmpleado', datos, { headers });
  }

  modificar(datos: EmpleadoModel) {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');
    const params = new HttpParams();

    return this.http.post(this.urlApi + 'ModificarEmpleado', datos, { headers, params });
  }

  guardarArchivo(archivo: Blob, codigoEmpleado: number, descripcion: string) {
    const formData = new FormData();
    const params = new HttpParams()
      .set('codigoEmpleado', codigoEmpleado)
      .set('descripcion', descripcion);

    formData.append('file', archivo);

    const req = new HttpRequest('POST', this.urlApi + 'GuardarArchivo', formData, { params: params, reportProgress: true });

    return this.http.request<EmpleadoArchivosModel>(req);
  }

  borrarArchivo(codigoEmpleado: number, idArchivo: number) {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');
    const params = new HttpParams()
      .set('codigoEmpleado', codigoEmpleado)
      .set('idArchivo', idArchivo);

    return this.http.post(this.urlApi + 'BorrarArchivo', null, { headers, params });
  }

}
