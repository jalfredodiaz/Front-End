import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ignoreElements } from 'rxjs';

// Servicios
import { AutenticacionService } from 'src/app/services/usuarios/autenticacion.service';
import { UsuarioLogueadoService } from 'src/app/services/usuarios/usuario-logueado.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private usuLogService: UsuarioLogueadoService,
    private autService: AutenticacionService
    ) {

   }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.usuLogService.DatosUsuario;
    const permisoRequerido = route.data['opcion'];

    if (currentUser) {
      // Validar vigencia token
      const HOY: any = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en-MX', '-7');
      const expiracion: any = formatDate(currentUser.FechaExpiracion, 'yyyy-MM-dd HH:mm:ss', 'en-MX', '-7');

      if (expiracion < HOY) {
        this.autService.cerrarSesionPorExpiracion();

        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });

        return false;
      }

      // Si esta accediendo al login, redireccionar a inicio por que esta logueado
      if (permisoRequerido === 'Login') {
        this.router.navigate(['/inicio']);
        return false;
      }

      // Validar permisos usuario logueado
      const tienePermiso = this.usuLogService.permisos.indexOf(permisoRequerido) > -1;

      // console.log('Permiso', permisoRequerido);

      // console.log('permisos', this.usuLogService.permisos);

      // console.log('tienePermiso', tienePermiso);

      if (tienePermiso) {
        return true;
      } else {
        if (permisoRequerido === 'Inicio') {
          return true;
        }
        // else if (permisoRequerido === 'CatalogoDepartamento') {
        //   return true;
        // }
        else {
          // Si no tene permisos redireccionar a inicio
          this.router.navigate(['/inicio']);
          return false;
        }
      }
    } else { // NO ESTA LOGUEADO
      // Si esta queriendo entrar al login conceder el permiso por que no esta logueado
      if (permisoRequerido === 'Login') {
        // console.log('permisoRequerido === "Login"');
        return true;
      } else {
        // console.log('False');
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return true;
      }
    }
  }
}
