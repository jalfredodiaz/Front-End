import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';


// Modelos
import { CambiarImagenPerfilModel } from 'src/app/models/usuarios/cambiar-imagen-perfil-model';
import { CorreoRecuperacion } from 'src/app/models/correo/correo-recuperacion';
import { RespuestaApiModel } from 'src/app/models/respuesta-api-model';
import { OpcionMenuModel } from 'src/app/models/usuarios/OpcionesMenu';
import { UsuarioAutenticado } from 'src/app/models/usuarios/usuario-autenticado';

// Srvicios
import { UtileriasService } from '../utilerias/utilerias.service';
import { UsuarioLogueadoService } from './usuario-logueado.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private urlApi: string;
  private menu: OpcionMenuModel[] = [];

  constructor(private http: HttpClient,
              private usuLog: UsuarioLogueadoService,
              private utilerias: UtileriasService) {
    this.urlApi = `${environment.urlApi}Usuario/`;
  }

  obtenerMenu() {
    if (this.menu.length > 1) {
      return of(this.menu);
    }

    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');

    return this.http.get<OpcionMenuModel[]>(this.urlApi + 'ObtenerMenu', { headers })
      .pipe(tap(menu => this.menu = menu));
  }

  obtenerPermisos() {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');

    return this.http.get<string[]>(this.urlApi + 'ObtenerPermisos', { headers })
      .subscribe((permisos: string[]) => {
        this.usuLog.permisos = permisos;
        this.usuLog.agregarPermisosBasicos();
      });
  }

  limpiarMenuPermisos() {
    this.menu = [];
    this.usuLog.permisos = [];
  }

  autenticarUsuario(usuario: string, password: string) {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');
    const body = {
      Usuario: usuario,
      Password: this.utilerias.encriptar(password)
    };

    return this.http.post<UsuarioAutenticado>(this.urlApi + 'AutenticarUsuario', body, { headers });
  }

  terminarSesionUsuario() {
    const usuario = this.usuLog.DatosUsuario.Login;
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');
    const params = new HttpParams().set('usuario', usuario);
    return this.http.post(this.urlApi + 'TerminarSesion', null, { headers, params })
      .pipe(
        finalize( () => {
          this.limpiarMenuPermisos();
      }));
  }

  actualizarPassword(IdUsuario: string, password: string) {
    const IDUsuario = IdUsuario;
    const NuevaPassword = this.utilerias.encriptar(password);
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');
    const body = {
      ID: IDUsuario,
      PasswordNueva: NuevaPassword
    };
    return this.http.post<RespuestaApiModel>(this.urlApi + 'ActualizarContrasenia', body, { headers });
  }

  validarCorreoRecuperacion(usuarioCorreo: string) {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');
    const body = {
      Usuario: usuarioCorreo
    };
    return this.http.post<CorreoRecuperacion>(this.urlApi + 'EnviarCorreoRecuperacion', body, { headers });
  }

  cambiarPassword(passwordActual: string, passwordNuevo: string) {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');
    const body = {
      Usuario: this.usuLog.DatosUsuario.Login,
      PasswordActual: this.utilerias.encriptar(passwordActual),
      PasswordNuevo: this.utilerias.encriptar(passwordNuevo)
    };

    return this.http.post(this.urlApi + 'CambiarPassword', body, { headers });
  }

  cambiarImagenPerfil(imagenBase64: string) {
    const headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');
    const datosImagen = new CambiarImagenPerfilModel();

    datosImagen.UsuarioLogin = this.usuLog.DatosUsuario.Login;
    datosImagen.ImagenBase64 = imagenBase64;

    return this.http.post(this.urlApi + 'CambiarImagenPerfil', datosImagen, { headers });
  }
}
