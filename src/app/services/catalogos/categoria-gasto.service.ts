import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

// Modelos
import { CategoriaGastoModel } from 'src/app/models/categoria-gasto/categoria-gasto-model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaGastoService {
  private urlApi: string;

  constructor(private http: HttpClient) {
    this.urlApi = `${environment.urlApi}CategoriasGasto/`;
  }

  obtenerListado() {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');

    return this.http.get<CategoriaGastoModel[]>(this.urlApi + 'ObtenerCategorias', { headers });
  }

  guardarCategoria(datos: CategoriaGastoModel) {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');

    return this.http.post<number>(this.urlApi + 'GuardarCategoria', datos, { headers });
  }
}
