import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'src/helpers/guards/auth.guard';
import { CortePrestamoComponent } from './capturas/corte-prestamo/corte-prestamo.component';
import { RegistroGastosIngresosCuentaComponent } from './capturas/registro-gastos-ingresos-cuenta/registro-gastos-ingresos-cuenta.component';
import { SolicitudPrestamoComponent } from './capturas/solicitud-prestamo/solicitud-prestamo.component';
import { CategoriaGastoComponent } from './catalogos/categoria-gasto/categoria-gasto.component';
import { DepartamentoComponent } from './catalogos/departamento/departamento.component';
import { EmpleadoComponent } from './catalogos/empleado/empleado.component';
import { PuestosComponent } from './catalogos/puestos/puestos.component';
import { TipoPrestamoComponent } from './catalogos/tipo-prestamo/tipo-prestamo.component';
import { ConsultaCorteDePrestamosComponent } from './consultas/consulta-corte-de-prestamos/consulta-corte-de-prestamos.component';
import { ConsultaEscalonadoComponent } from './consultas/consulta-escalonado/consulta-escalonado.component';
import { ConsultaMovimientosCuentaComponent } from './consultas/consulta-movimientos-cuenta/consulta-movimientos-cuenta.component';
import { ConsultaSolicitudPrestamosComponent } from './consultas/consulta-solicitud-prestamos/consulta-solicitud-prestamos.component';

// Componentes
import { InicioComponent } from './inicio/inicio.component';
import { CambiarFotoComponent } from './login/cambiar-foto/cambiar-foto.component';
import { CambiarPasswordComponent } from './login/cambiar-password/cambiar-password.component';
import { PagesComponent } from './pages.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'inicio', component: InicioComponent, canActivate: [AuthGuard],
        data: { opcion: 'Inicio' }
      },
      /* CATALOGOS */
      {
        path: 'Catalogos/Departamentos', component: DepartamentoComponent, canActivate: [AuthGuard],
        data: { opcion: 'CatalogoDepartamento' }
      },
      {
        path: 'Catalogos/Categoria', component: CategoriaGastoComponent, canActivate: [AuthGuard],
        data: { opcion: 'CatalogoCategoria' }
      },
      {
        path: 'Catalogos/Puestos', component: PuestosComponent, canActivate: [AuthGuard],
        data: { opcion: 'CatalogoPuestos' }
      },
      {
        path: 'Catalogos/Empleados', component: EmpleadoComponent, canActivate: [AuthGuard],
        data: { opcion: 'CatalogoEmpleados' }
      },
      {
        path: 'Catalogos/TipoPrestamo', component: TipoPrestamoComponent, canActivate: [AuthGuard],
        data: { opcion: 'CatalogoTipoPrestamo' }
      },

      /* CAPTURAS */

      {
        path: 'Capturas/SolicitudPrestamo', component: SolicitudPrestamoComponent, canActivate: [AuthGuard],
        data: { opcion: 'CapturaSolicitudPrestamo' }
      },
      {
        path: 'Capturas/CorteDePrestamos', component: CortePrestamoComponent, canActivate: [AuthGuard],
        data: { opcion: 'CapturaCorteDePrestamos' }
      },
      {
        path: 'Capturas/RegistroIngresoGastos', component: RegistroGastosIngresosCuentaComponent, canActivate: [AuthGuard],
        data: { opcion: 'CapturaIngresoGasto' }
      },

      /* CONSULTAS */

      {
        path: 'Consultas/SolicitudPrestamo', component: ConsultaSolicitudPrestamosComponent, canActivate: [AuthGuard],
        data: { opcion: 'ConsultaSolicitudDePrestamos' }
      },
      {
        path: 'Consultas/CorteDePrestamos', component: ConsultaCorteDePrestamosComponent, canActivate: [AuthGuard],
        data: { opcion: 'ConsultaCorteDePrestamos' }
      },
      {
        path: 'Consultas/SaldosCuentas', component: ConsultaMovimientosCuentaComponent, canActivate: [AuthGuard],
        data: { opcion: 'ConsultaSaldosCuentas' }
      },
      {
        path: 'Consultas/Escalonado', component: ConsultaEscalonadoComponent, canActivate: [AuthGuard],
        data: { opcion: 'ConsultaEscalonado' }
      },


      /* GENERALES */

      {
        path: 'seguridad/password/cambiar', component: CambiarPasswordComponent, canActivate: [AuthGuard],
        data: { opcion: 'CambiarContraseña' }
      },
      {
        path: 'perfil/cambiar-foto', component: CambiarFotoComponent, canActivate: [AuthGuard],
        data: { opcion: 'CambiarFoto' }
      },
      {
        path: '', redirectTo: '/inicio', pathMatch: 'full'
      },
      {
        path: '**', redirectTo: '/404'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
