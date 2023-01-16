import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input'
import { MatDividerModule } from '@angular/material/divider';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';





// Componentes
import { CategoriaGastoAyudaComponent } from './catalogos/categoria-gasto/categoria-gasto-ayuda/categoria-gasto-ayuda.component';
import { CategoriaGastoComponent } from './catalogos/categoria-gasto/categoria-gasto.component';
import { CategoriaGastoEdicionComponent } from './catalogos/categoria-gasto/categoria-gasto-edicion/categoria-gasto-edicion.component';
import { CambiarPasswordComponent } from './login/cambiar-password/cambiar-password.component';
import { CambiarFotoComponent } from './login/cambiar-foto/cambiar-foto.component';
import { ConfiguracionGeneralComponent } from './catalogos/configuracion-general/configuracion-general.component';
import { CortePrestamoComponent } from './capturas/corte-prestamo/corte-prestamo.component';
import { DepartamentoAyudaComponent } from './catalogos/departamento/departamento-ayuda/departamento-ayuda.component';
import { DepartamentoComponent } from './catalogos/departamento/departamento.component';
import { DepartamentoEdicionComponent } from './catalogos/departamento/departamento-edicion/departamento-edicion.component';
import { EmpleadoAyudaComponent } from './catalogos/empleado/empleado-ayuda/empleado-ayuda.component';
import { EmpleadoComponent } from './catalogos/empleado/empleado.component';
import { EmpleadoEdicionComponent } from './catalogos/empleado/empleado-edicion/empleado-edicion.component';
import { FooterComponent } from './shared/footer/footer.component';
import { GastosComponent } from './capturas/gastos/gastos.component';
import { GastosCuentaPublicaComponent } from './capturas/gastos-cuenta-publica/gastos-cuenta-publica.component';
import { GastosCuentaMantenimientoComponent } from './capturas/gastos-cuenta-mantenimiento/gastos-cuenta-mantenimiento.component';
import { HeaderComponent } from './shared/header/header.component';
import { IngresoComponent } from './capturas/ingreso/ingreso.component';
import { IngresoCuentaPublicaComponent } from './capturas/ingreso-cuenta-publica/ingreso-cuenta-publica.component';
import { IngresoCuentaMantenimientoComponent } from './capturas/ingreso-cuenta-mantenimiento/ingreso-cuenta-mantenimiento.component';
import { IngresoCuentaPrestamoComponent } from './capturas/ingreso-cuenta-prestamo/ingreso-cuenta-prestamo.component';
import { InicioComponent } from './inicio/inicio.component';
import { MatPaginatorCustomComponent } from './shared/mat-paginator-custom/mat-paginator-custom.component';
import { MenuComponent } from './shared/menu/menu.component';
import { PagesComponent } from './pages.component';
import { PerfilComponent } from './login/perfil/perfil.component';
import { PuestoAyudaComponent } from './catalogos/puestos/puesto-ayuda/puesto-ayuda.component';
import { PuestosComponent } from './catalogos/puestos/puestos.component';
import { PuestoEdicionComponent } from './catalogos/puestos/puesto-edicion/puesto-edicion.component';
import { SeleccionarArchivoComponent } from './seleccionar-archivo/seleccionar-archivo.component';
import { SolicitudPrestamoAyudaComponent } from './capturas/solicitud-prestamo/solicitud-prestamo-ayuda/solicitud-prestamo-ayuda.component';
import { SolicitudPrestamoComponent } from './capturas/solicitud-prestamo/solicitud-prestamo.component';
import { SolicitudPrestamoHistorialComponent } from './capturas/solicitud-prestamo/solicitud-prestamo-historial/solicitud-prestamo-historial.component';
import { TabuladorTiempoAntiguedadComponent } from './catalogos/tabulador-tiempo-antiguedad/tabulador-tiempo-antiguedad.component';
import { TipoPrestamoAyudaComponent } from './catalogos/tipo-prestamo/tipo-prestamo-ayuda/tipo-prestamo-ayuda.component';
import { TipoPrestamoComponent } from './catalogos/tipo-prestamo/tipo-prestamo.component';
import { TipoPrestamoEdicionComponent } from './catalogos/tipo-prestamo/tipo-prestamo-edicion/tipo-prestamo-edicion.component';
import { TipoGastoComponent } from './catalogos/tipo-gasto/tipo-gasto.component';
import { TabuladorDiasAguinaldoComponent } from './catalogos/tabulador-dias-aguinaldo/tabulador-dias-aguinaldo.component';



// DIRECTIVAS
import { LocalizedNumericInputDirective } from '../directives/localized-numeric-input.directive';
import { FormatNumberDirective } from '../directives/format-number.directive';



// Modulos
import { PagesRoutingModule } from './pages-routing.module';



// Pipes
import { SiNoPipe } from '../pipes/si-no.pipe';
import { FormatearNumeroPipe } from '../pipes/formatear-numero.pipe';
import { SafeUrlPipe } from '../pipes/safe-url-pipe.pipe';
import { ConsultaSolicitudPrestamosComponent } from './consultas/consulta-solicitud-prestamos/consulta-solicitud-prestamos.component';
import { ConsultaCorteDePrestamosComponent } from './consultas/consulta-corte-de-prestamos/consulta-corte-de-prestamos.component';
import { CortePrestamoAyudaComponent } from './capturas/corte-prestamo/corte-prestamo-ayuda/corte-prestamo-ayuda.component';
import { CortePrestamoDetalleComponent } from './capturas/corte-prestamo/corte-prestamo-detalle/corte-prestamo-detalle.component';
import { RegistroGastosIngresosCuentaComponent } from './capturas/registro-gastos-ingresos-cuenta/registro-gastos-ingresos-cuenta.component';
import { ConsultaMovimientosCuentaComponent } from './consultas/consulta-movimientos-cuenta/consulta-movimientos-cuenta.component';
import { CuentasAyudaComponent } from './catalogos/cuentas/cuentas-ayuda/cuentas-ayuda.component';
import { RegistroGastosIngresosCuentaAyudaComponent } from './capturas/registro-gastos-ingresos-cuenta/registro-gastos-ingresos-cuenta-ayuda/registro-gastos-ingresos-cuenta-ayuda.component';
import { MatSelectModule } from '@angular/material/select';
import { ConsultaEscalonadoComponent } from './consultas/consulta-escalonado/consulta-escalonado.component';
import { PuestoAumentarSueldoComponent } from './catalogos/puestos/puesto-aumentar-sueldo/puesto-aumentar-sueldo.component';


@NgModule({
  declarations: [
    PagesComponent,
    TipoPrestamoComponent,
    PuestosComponent,
    EmpleadoComponent,
    TabuladorTiempoAntiguedadComponent,
    DepartamentoComponent,
    ConfiguracionGeneralComponent,
    TipoGastoComponent,
    TabuladorDiasAguinaldoComponent,
    GastosComponent,
    GastosCuentaPublicaComponent,
    GastosCuentaMantenimientoComponent,
    SolicitudPrestamoComponent,
    CortePrestamoComponent,
    IngresoComponent,
    IngresoCuentaPublicaComponent,
    IngresoCuentaMantenimientoComponent,
    IngresoCuentaPrestamoComponent,
    FooterComponent,
    HeaderComponent,
    MenuComponent,
    InicioComponent,
    CambiarPasswordComponent,
    CambiarFotoComponent,
    PerfilComponent,
    CategoriaGastoAyudaComponent,
    CategoriaGastoComponent,
    CategoriaGastoEdicionComponent,
    DepartamentoEdicionComponent,
    PuestoEdicionComponent,
    PuestoAyudaComponent,


    /* DIRECTIVES */
    LocalizedNumericInputDirective,
    FormatNumberDirective,


    /* PIPES */
    SiNoPipe,
    FormatearNumeroPipe,
    SafeUrlPipe,


    DepartamentoAyudaComponent,
    EmpleadoEdicionComponent,
    EmpleadoAyudaComponent,
    MatPaginatorCustomComponent,
    TipoPrestamoAyudaComponent,
    TipoPrestamoEdicionComponent,
    SolicitudPrestamoAyudaComponent,
    SolicitudPrestamoHistorialComponent,
    SeleccionarArchivoComponent,
    ConsultaSolicitudPrestamosComponent,
    ConsultaCorteDePrestamosComponent,
    CortePrestamoAyudaComponent,
    CortePrestamoDetalleComponent,
    RegistroGastosIngresosCuentaComponent,
    ConsultaMovimientosCuentaComponent,
    CuentasAyudaComponent,
    RegistroGastosIngresosCuentaAyudaComponent,
    ConsultaEscalonadoComponent,
    PuestoAumentarSueldoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatRadioModule,
    MatInputModule,
    MatDividerModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatNativeDateModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatGridListModule,
    PagesRoutingModule
  ],
  exports: [
    PagesComponent,
    TipoPrestamoComponent,
    PuestosComponent,
    EmpleadoComponent,
    TabuladorTiempoAntiguedadComponent,
    DepartamentoComponent,
    ConfiguracionGeneralComponent,
    TipoGastoComponent,
    TabuladorDiasAguinaldoComponent,
    GastosComponent,
    GastosCuentaPublicaComponent,
    GastosCuentaMantenimientoComponent,
    SolicitudPrestamoComponent,
    CortePrestamoComponent,
    IngresoComponent,
    IngresoCuentaPublicaComponent,
    IngresoCuentaMantenimientoComponent,
    IngresoCuentaPrestamoComponent,
    FooterComponent,
    HeaderComponent,
    MenuComponent,
    InicioComponent,
    CambiarPasswordComponent,
    CambiarFotoComponent,
    PerfilComponent,
    PagesComponent
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: MatPaginatorCustomComponent },
    { provide: MAT_DATE_LOCALE, useValue: "es-MX" },
    // { provide: MAT_DATE_FORMATS, useValue: {
    //   parse: {
    //     dateInput: 'LL',
    //   },
    //   display: {
    //     dateInput: 'DD/MM/YYYY',
    //     monthYearLabel: 'MMM YYYY',
    //     dateA11yLabel: 'LL',
    //     monthYearA11yLabel: 'MMMM-YYYY',
    //   }
    // }}
  ]
})
export class PagesModule { }
