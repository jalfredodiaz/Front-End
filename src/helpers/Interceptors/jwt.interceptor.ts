import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

// Configuracion


// Servicios

import { UtileriasService } from 'src/app/services/utilerias/utilerias.service';
import { UsuarioLogueadoService } from 'src/app/services/usuarios/usuario-logueado.service';
import { environment } from 'src/environments/environment';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private usoLogService: UsuarioLogueadoService,
                private utileriasService: UtileriasService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      // Agregar Authorization al HEADER de la peticion HTTP add authorization header
      // con el token actual del usuario logueado
      const currentUser = this.usoLogService.DatosUsuario;

      if (currentUser && currentUser.Token &&
              (request.url !== 'http://api.ipify.org/?format=json'
              && request.url !== 'https://api.ipify.org/?format=json') ){
          request = request.clone({
              setHeaders: {
              Authorization: `Bearer ${currentUser.Token}`
              }
          });
      }

      this.usoLogService.segundosExpiracion = environment.segundosExpiracionSesion;

      return next.handle(request);
    }
}
