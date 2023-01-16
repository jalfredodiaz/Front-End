import { formatDate } from '@angular/common';
import { Attribute, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith, Subscription } from 'rxjs';


// Modelos
import { RegistroGastosIngresosModel } from 'src/app/models/cuentas/registro-gastos-ingresos-model';
import { CuentasService } from 'src/app/services/catalogos/cuentas.service';
import { UtileriasService } from 'src/app/services/utilerias/utilerias.service';


@Component({
  selector: 'app-registro-gastos-ingresos-cuenta-ayuda',
  templateUrl: './registro-gastos-ingresos-cuenta-ayuda.component.html',
  styleUrls: ['./registro-gastos-ingresos-cuenta-ayuda.component.css']
})
export class RegistroGastosIngresosCuentaAyudaComponent implements OnInit {
  myControl = new FormControl();
  options: RegistroGastosIngresosModel[];
  filteredOptions: Observable<RegistroGastosIngresosModel[]>;

  private cargando: boolean = false;
  private noBuscar: boolean = false;

  private subscripcionRefrescar: Subscription;

  @Input() set codigo(valor: number) {
    if (this.cargando) { return; }

    this.cargando = true;

    if (this.options) {
      this.buscarOpcion(valor);
    } else {
      if (this.idCuenta && this.idCuenta > 0 && this.esIngreso) {
        this.cortePrestamoServ.obtenerRegistroGastosIngresosPorCuenta(this.idCuenta, this.esIngreso)
          .subscribe({
            next: (datos: RegistroGastosIngresosModel[]) => {
              this.options = datos;

              this.crearEventoCambio();
              this.buscarOpcion(valor);
            },
            error: (error) => {
              this.utilerias.mensajeAdvertencia('ADVERTENCIA', error);
              this.cargando = false;
            }
          });
      } else {
        this.options = [];
        this.crearEventoCambio();
        this.cargando = false;
      }
    }
  }
  @Output() codigoChange = new EventEmitter<number>();

  @Input() nombre: string;
  @Output() nombreChange = new EventEmitter<string>();
  @Output() change = new EventEmitter<RegistroGastosIngresosModel>();
  @Input() refrescarDatos = new EventEmitter();
  @Input() editable: boolean = true;
  @Input() idCuenta: number = 0;
  @Input() esIngreso: boolean = true;

  constructor(@Attribute('titulo') public titulo: string,
    private cortePrestamoServ: CuentasService,
    private utilerias: UtileriasService) {
  }

  ngOnInit() {
    this.crearEventoRefrescar();
  }

  ngOnDestroy(): void {
    this.subscripcionRefrescar.unsubscribe();
  }

  private crearEventoRefrescar() {
    this.subscripcionRefrescar = this.refrescarDatos
      .subscribe({
        next: () => {
          // console.log('refrescarMovimientos');

          if (this.idCuenta && this.idCuenta > 0 && this.esIngreso != null) {
            this.cortePrestamoServ.obtenerRegistroGastosIngresosPorCuenta(this.idCuenta, this.esIngreso)
              .subscribe({
                next: (datos: RegistroGastosIngresosModel[]) => {
                  this.options = datos;

                  this.crearEventoCambio();
                },
                error: (error) => {
                  this.utilerias.mensajeAdvertencia('ADVERTENCIA', error);
                  this.cargando = false;
                }
              });
          } else {
            this.options = [];
            this.crearEventoCambio();
            this.cargando = false;
          }
        }
      });
  }

  private crearEventoCambio() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        if (typeof value === 'string') {
          if ((!value || value == null || value == '') && !this.cargando) {
            this.codigoChange.emit(0);
            this.nombreChange.emit('');
            this.change.emit(null);
          }

          return value;
        } else {
          let valor = value as RegistroGastosIngresosModel;

          this.noBuscar = true;

          this.codigoChange.emit(valor.nIdMovimiento);
          this.nombreChange.emit('');
          this.change.emit(valor);

          return `Folio: ${valor.nIdMovimiento} | ${valor.NombreTipoMovimiento} | ${valor.NombreCategoria} | ${formatDate(valor.dFecha_Registro, 'yyyy-MM-dd', 'en-MX')} | ${valor.Cancelado ? 'CANCELADO' : 'ACTIVO'}`;
        }
      }),
      map(name => {
        // console.log('name');
        return (name ? this._filter(name) : this.options.slice());
      }),
    );
  }

  private buscarOpcion(valor: number) {
    if (this.noBuscar) {
      this.noBuscar = false;
      this.cargando = false;
      return;
    }

    let resultado = this.options.filter(p => p.nIdMovimiento == valor);

    if (resultado && resultado.length > 0) {
      this.myControl.setValue(resultado[0]);
    } else {
      this.myControl.setValue('');
    }

    // El objetivo de esta  promesa es dar tiempo a otras operaciones desencadenadas para que tomen el valor
    // que aun sigue cargandose.
    setTimeout(() => {
      this.cargando = false;
      this.noBuscar = false;
    }, 500);
  }

  displayFn(opcion: RegistroGastosIngresosModel): string {
    return opcion && opcion.nIdMovimiento ? opcion.nIdMovimiento.toString() : '';
  }

  private _filter(name: string): RegistroGastosIngresosModel[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option =>
      `Folio: ${option.nIdMovimiento} | ${option.NombreTipoMovimiento} | ${option.NombreCategoria} | ${formatDate(option.dFecha_Registro, 'yyyy-MM-dd', 'en-MX')} | ${this.utilerias.formatearNumero(option.nImporte.toString())} | ${option.Cancelado ? 'CANCELADO' : 'ACTIVO'}`.toLowerCase().includes(filterValue));
  }
}
