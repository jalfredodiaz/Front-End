import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';

// Modelos
import { UsuarioAutenticado } from 'src/app/models/usuarios/usuario-autenticado';

// Servicios
import { UtileriasService } from '../utilerias/utilerias.service';
import { UsuarioLogueadoService } from './usuario-logueado.service';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
  public mensajeErrorS = new EventEmitter<string>();

  constructor(private router: Router,
    private usuarioService: UsuarioService,
    private utilerias: UtileriasService,
    private usuLogService: UsuarioLogueadoService) { }

  iniciarSesion(usuario: string, password: string, rutaDestino: string) {
    this.llamarApiIniciarSesion(usuario, password, rutaDestino);
  }

  private llamarApiIniciarSesion(usuario: string, password: string, rutaDestino: string) {
    // this.utilerias.mensajeTrabajando('ENTRANDO', 'Espere un momento, se estan validando sus datos.');

    this.usuarioService.autenticarUsuario(usuario, password)
      .subscribe(
        {
          next: (usuarioLog: UsuarioAutenticado) => {
            // this.utilerias.cerrarMensajeTrabajando();

            this.usuarioService.limpiarMenuPermisos();
            this.usuLogService.establecerUsuarioLogueado(usuarioLog);

            this.router.navigate([rutaDestino]);
          },
          error: (error) => {
            // this.utilerias.cerrarMensajeTrabajando();
            this.mensajeErrorS.emit(error);
          }
        }
      );
  }

  cerrarSesion() {
    this.usuarioService.terminarSesionUsuario()
      .subscribe(
        {
          next: () => {
            this.usuLogService.quitarUsuarioLogueado();
            this.utilerias.cerrarMensajeTrabajando();
          },
          error: (error) => {
            this.mensajeErrorS.emit(error);
          }
        }
      );
  }

  cerrarSesionPorExpiracion() {
    this.usuLogService.quitarUsuarioLogueado();
    this.utilerias.cerrarMensajeTrabajando();
  }
}
