import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';


// Modelos
import { UsuarioAutenticado } from 'src/app/models/usuarios/usuario-autenticado';


// Servicios
import { UtileriasService } from '../utilerias/utilerias.service';


@Injectable({
  providedIn: 'root'
})
export class UsuarioLogueadoService implements OnInit, OnDestroy {
  private usuarioLoginSubject: BehaviorSubject<UsuarioAutenticado>;
  private usuarioLogin!: Observable<UsuarioAutenticado>;
  private usuarioLoginSubscripcion!: Subscription;
  public segundosExpiracion: number = 0;
  public logueado = false;
  private cambiandoDatosUsuarioLogueado = false;
  public permisos: string[] = [];
  private datosLogin: Storage = localStorage;

  constructor(private router: Router,
              private utileriasServices: UtileriasService) {
    // Obtener los datos almacenados del usuario logueado
    const usuLogJSON: string = this.datosLogin.getItem('usuarioLogin') as string;
    // Desencriptar los datos del usuario logueado
    let datosSesion: string = utileriasServices.desencriptar(usuLogJSON);

    // Crear observable que cacha los cambios del usuario logueado.
    this.usuarioLoginSubject = new BehaviorSubject<UsuarioAutenticado>(JSON.parse(datosSesion));
    this.usuarioLogin = this.usuarioLoginSubject.asObservable();

    // Subscripción a los cambios en los datos del usuario logueado
    this.usuarioLoginSubscripcion = this.usuarioLogin
      .subscribe({
        next: (user) => {
          // console.log('user', user);
          // Si user es null se establece que no esta logueado
          this.logueado = user != null;

          // console.log('user', user);

          if (!this.logueado && !this.cambiandoDatosUsuarioLogueado) {
            const url = this.router.url;

            if (url.indexOf('/seguridadCambioPassword/CambioPassword/') < 0 && url.indexOf('/funciones-especiales/') < 0) {
              this.router.navigate(['/login']);
            }
          } else {
            this.segundosExpiracion = environment.segundosExpiracionSesion;

            // valida si el usuario tiene una imagend e perfil, si no la tiene le asigna una
            // dependiendo del sexo.
            // if (user.foto === null || user.foto.length === 0) {
            if (user.Hombre) {
              user.Foto = environment.imagenPerfilHombre;
            } else {
              user.Foto = environment.imagenPerfilMujer;
            }
            // }
          }
        }
      });
  }

  ngOnInit(): void {
    // console.log('ngOnInit');

    this.agregarPermisosBasicos();
  }

  ngOnDestroy(): void {
    // Terminar la subscripcion a los datos del usuario logueado
    this.usuarioLoginSubject.unsubscribe();
    this.usuarioLoginSubscripcion.unsubscribe();
  }

  public get DatosUsuario(): UsuarioAutenticado {
    // Esta funcion solo se utiliza para simprificar la obtencion de datos del usuario logueado
    return this.usuarioLoginSubject.value;
  }

  establecerUsuarioLogueado(usuLog: UsuarioAutenticado) {
    if (!usuLog.Foto) {
      if (usuLog.Hombre) {
        usuLog.Foto = environment.imagenPerfilHombre;
      } else {
        usuLog.Foto = environment.imagenPerfilMujer;
      }
    }

    const usuLogJSON: string = JSON.stringify(usuLog);
    const datosEncriptados: string = this.utileriasServices.encriptar(usuLogJSON);

    // console.log('usuLog', usuLog);
    this.segundosExpiracion = environment.segundosExpiracionSesion;
    this.datosLogin.setItem('usuarioLogin', datosEncriptados);
    this.usuarioLoginSubject.next(usuLog);
  }
  quitarUsuarioLogueado() {
    this.datosLogin.removeItem('usuarioLogin');
    this.usuarioLoginSubject.next(null);

    if (!this.cambiandoDatosUsuarioLogueado) {
      this.router.navigate(['/login']);
    }

    this.segundosExpiracion = 0;
    this.permisos = [];
  }

  reestablecerUsuarioLogueado(usuLog: UsuarioAutenticado) {
    this.cambiandoDatosUsuarioLogueado = true;

    this.quitarUsuarioLogueado();
    this.establecerUsuarioLogueado(usuLog);

    this.cambiandoDatosUsuarioLogueado = false;
  }

  agregarPermisosBasicos() {
    if (this.permisos === null) {
      this.permisos = [];
    }

    if (this.permisos.indexOf('Inicio') < 0) { this.permisos.push('Inicio'); }
    if (this.permisos.indexOf('CambiarContraseña') < 0) { this.permisos.push('CambiarContraseña'); }
    if (this.permisos.indexOf('CambiarFoto') < 0) { this.permisos.push('CambiarFoto'); }
    if (this.permisos.indexOf('Login') < 0) { this.permisos.push('Login'); }
  }
  public ampliarTiempoActividad() {
    this.segundosExpiracion = environment.segundosExpiracionSesion;
  }
}
