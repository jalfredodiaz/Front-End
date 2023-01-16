import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/helpers/guards/auth.guard';


import { LoginComponent } from './sesion/login/login.component';
import { NuevaPasswordComponent } from './sesion/nueva-password/nueva-password.component';
import { RecuperarPasswordComponent } from './sesion/recuperar-password/recuperar-password.component';
import { NoPageFoundComponent } from './shared/no-page-found/no-page-found.component';

const routes: Routes = [
  {
    path: '', redirectTo: '/inicio', pathMatch: 'full'
  },
  {
    path: 'defaultsite', redirectTo: '/inicio', pathMatch: 'full'
  },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard], data: { opcion: 'Login' } },
  // { path: 'seguridad/no-autorizado', component: PaginaSinAutorizacionComponent },

  // Olvide usuario/contrasenia
  { path: 'seguridadPassword/recuperar', component: RecuperarPasswordComponent },
  { path: 'seguridadCambioPassword/CambioPassword/:id', component: NuevaPasswordComponent },


  //

  // redireccionar al inicio cuando no se encuentre una pagina especifica
  { path: '404', component: NoPageFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
