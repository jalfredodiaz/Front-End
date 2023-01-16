import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

// Servicios
import { UsuarioLogueadoService } from 'src/app/services/usuarios/usuario-logueado.service';


// Interpecta los errores arrojados por el llamado a las APIs
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private usoLog: UsuarioLogueadoService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            // console.log('ERROR', err);
            // El error 401 indica que la API arrojo que el usuario no esta autenticado
            // o que sus credenciales ya expiraron. Por eso, debemos redireccionar al Login
            // y quitar los datos de usuario logueado.
            if (err.status === 401) {
              // console.log('401');
                this.usoLog.quitarUsuarioLogueado();
                location.reload();
            }

            let error: any;

            if (!environment.production) {
                console.log('ERROR DEBUG', err);
            }

            if (err.status === 500) {
                error = 'Ocurrio un error al procesar su solicitud, espere unos minutos e intente de nuevo.';
            } else if(err.status === 503) {
                error = 'El servicio se encuentra ocupado o su internet presenta alguna intermitencia, espere unos segundos e intente de nuevo.';
            } else {
                if (err.error.Message) {
                  error = err.error.Message;
                } else {
                  error = 'Ocurrio un error al procesar su solicitud, espere unos minutos e intente de nuevo.';
                }
            }

            return throwError(error);
        }));
    }
}
