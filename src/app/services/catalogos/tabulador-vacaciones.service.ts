import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

// Modelos
import { TabuladorVacacionesModel } from 'src/app/models/tabulador-vacaciones/tabulador-vacaciones-model';

@Injectable({
  providedIn: 'root'
})
export class TabuladorVacacionesService {
  private urlApi: string;

  constructor(private http: HttpClient) {
    this.urlApi = `${environment.urlApi}TabuladorPrimaVacacional/`;
  }

  obtenerListado() {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');

    return this.http.get<TabuladorVacacionesModel[]>(this.urlApi + 'ObtenerTabuladorVacaciones', { headers });
  }

  obtenerPorId(ano: number) {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');
    const params = new HttpParams().set('id', ano);

    return this.http.get<TabuladorVacacionesModel>(this.urlApi + 'ObtenerTabuladorVacacionesPorId', { headers, params });
  }
}
