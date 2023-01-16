import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, tap } from 'rxjs';
import { PuestoModel } from 'src/app/models/puesto/puesto-model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PuestoService {
  private urlApi: string;
  // private puestos: PuestoModel[];

  constructor(private http: HttpClient) {
    this.urlApi = `${environment.urlApi}Puestos/`;
  }

  obtenerListado() {
    // if (this.puestos) {
    //   return of(this.puestos);
    // }

    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');

    return this.http.get<PuestoModel[]>(this.urlApi + 'ObtenerPuestos', { headers });
      // .pipe(tap(puestos => this.puestos = puestos));
  }

  obtenerFiltrado(nombre: string, activos: boolean, inactivos: boolean) {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');
    const params = new HttpParams()
      .set('filtro', nombre)
      .set('activos', activos)
      .set('inactivos', inactivos);

    return this.http.get<PuestoModel[]>(this.urlApi + 'ObtenerPuestosPorNombre', { headers, params });
  }

  obtener(codigo: number) {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');
    const params = new HttpParams()
      .set('codigo', codigo);

    return this.http.get<PuestoModel>(this.urlApi + 'ObtenerPuesto', { headers, params });
  }

  guardar(datos: PuestoModel) {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');

    return this.http.post<number>(this.urlApi + 'GuardarPuesto', datos, { headers });
  }

  modificar(datos: PuestoModel) {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');
    const params = new HttpParams()
      .set('codigo', datos.nIdPuesto)
      .set('nombre', datos.cPuesto)
      .set('activo', datos.bActivo)
      .set('codigoPadre', datos.nIdPuestoPadre)
      .set('codigoDepartamento', datos.nIdDepartamento)
      .set('sueldo', datos.nSueldo);

    return this.http.post(this.urlApi + 'ModificarPuesto', null, { headers, params });
  }

  aumentarSueldo(porcentaje: number) {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');
    const params = new HttpParams().set('porcentaje', porcentaje);

    return this.http.post(this.urlApi + 'AumentarSueldo', null, { headers, params });
  }

  aumentarSueldoPorDepartamento(idDepartamento: number, porcentaje: number) {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');
    const params = new HttpParams()
      .set('idDepartamento', idDepartamento)
      .set('porcentaje', porcentaje);

    return this.http.post(this.urlApi + 'AumentarSueldoPorDepartamento', null, { headers, params });
  }
}
