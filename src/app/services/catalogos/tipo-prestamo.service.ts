import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TipoPrestamoModel } from 'src/app/models/tipo-prestamo/tipo-prestamo-model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoPrestamoService {
  private urlApi: string;

  constructor(private http: HttpClient) {
    this.urlApi = `${environment.urlApi}TipoPrestamo/`;
  }

  obtenerListado() {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');

    return this.http.get<TipoPrestamoModel[]>(this.urlApi + 'ObtenerTipoPrestamo', { headers });
  }

  guardar(datos: TipoPrestamoModel) {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');

    return this.http.post<number>(this.urlApi + 'GuardarTipoPrestamo', datos, { headers });
  }

  modificar(datos: TipoPrestamoModel) {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');

    return this.http.post(this.urlApi + 'ModificarTipoPrestamo', datos, { headers });
  }
}
