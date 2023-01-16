import { Component, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';


// Servicios
import { AutenticacionService } from '../services/usuarios/autenticacion.service';
import { UsuarioLogueadoService } from '../services/usuarios/usuario-logueado.service';


@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {
  private subscripcionTimer: Subscription;
  // public segundosExpiracion: number;
  public esperandoRespuesta = false;

  constructor(private autenticacionService: AutenticacionService,
              public usuarioLogueadoService: UsuarioLogueadoService) {
    this.esperandoRespuesta = false;
  }

  ngOnInit(): void {
    this.subscripcionTimer = timer(0, 1000)
      .subscribe(() => {
        // Validar si el usuario esta logueado
        if (this.usuarioLogueadoService.logueado) {
          // Validar si espera respuesta
          if (!this.esperandoRespuesta) {
            if (this.usuarioLogueadoService.segundosExpiracion <= 60) {
              this.esperandoRespuesta = true;
            }
          }

          if (isNaN(this.usuarioLogueadoService.segundosExpiracion) || this.usuarioLogueadoService.segundosExpiracion === undefined) {
            this.usuarioLogueadoService.ampliarTiempoActividad();
          } else {
            this.usuarioLogueadoService.segundosExpiracion--;
          }

          // console.log(this.usuarioLogueadoService.segundosExpiracion);

          if (this.usuarioLogueadoService.segundosExpiracion === 0) {
            this.autenticacionService.cerrarSesion();
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.subscripcionTimer.unsubscribe();
  }

  ampliarTiempo() {
    this.usuarioLogueadoService.ampliarTiempoActividad();
    this.esperandoRespuesta = false;
  }

  cerrarSesion() {
    this.autenticacionService.cerrarSesion();
  }
}
