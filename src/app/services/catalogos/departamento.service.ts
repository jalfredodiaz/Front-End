import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


// Modelos
import { DepartamentoModel } from 'src/app/models/departamento/departamento-model';



@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {
  private urlApi: string;
  // private departamentos: DepartamentoModel[];

  constructor(private http: HttpClient) {
    this.urlApi = `${environment.urlApi}Departamentos/`;
  }

  obtenerListado() {
    // if (this.departamentos) {
    //   return of(this.departamentos);
    // }

    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');

    return this.http.get<DepartamentoModel[]>(this.urlApi + 'ObtenerDepartamentos', { headers });
      // .pipe(tap(departamentos => this.departamentos = departamentos));
  }

  guardarDepartamento(datos: DepartamentoModel) {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');

    return this.http.post<number>(this.urlApi + 'GuardarDepartamento', datos, { headers });
  }
}
