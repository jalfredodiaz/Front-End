import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

// Modelos
import { TabuladorAguinaldoModel } from 'src/app/models/tabulador-aguinaldo/tabulador-aguinaldo-model';

@Injectable({
  providedIn: 'root'
})
export class TabuladorAguinaldoService {
  private urlApi: string;

  constructor(private http: HttpClient) {
    this.urlApi = `${environment.urlApi}TabuladorAguinaldo/`;
  }

  obtenerListado() {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');

    return this.http.get<TabuladorAguinaldoModel[]>(this.urlApi + 'ObtenerTabuladorAguinaldo', { headers });
  }

  obtenerPorId(ano: number) {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');
    const params = new HttpParams().set('id', ano);

    return this.http.get<TabuladorAguinaldoModel>(this.urlApi + 'ObtenerTabuladorAguinaldoPorId', { headers, params });
  }
}
