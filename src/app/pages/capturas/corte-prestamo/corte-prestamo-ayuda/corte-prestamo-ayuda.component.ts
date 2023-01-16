import { formatDate } from '@angular/common';
import { Attribute, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith, Subscription } from 'rxjs';

// Models
import { CortePrestamoModel } from 'src/app/models/corte-prestamo/corte-prestamo-model';


// Servicios
import { CortePrestamoService } from 'src/app/services/capturas/corte-prestamo.service';
import { UtileriasService } from 'src/app/services/utilerias/utilerias.service';


@Component({
  selector: 'app-corte-prestamo-ayuda',
  templateUrl: './corte-prestamo-ayuda.component.html',
  styleUrls: ['./corte-prestamo-ayuda.component.css']
})
export class CortePrestamoAyudaComponent implements OnInit, OnDestroy {
  myControl = new FormControl();
  options: CortePrestamoModel[];
  filteredOptions: Observable<CortePrestamoModel[]>;

  private cargando: boolean = false;
  private noBuscar: boolean = false;

  private subscripcionRefrescar: Subscription;

  @Input() set codigo(valor: number) {
    if (this.cargando) { return; }

    this.cargando = true;

    if (this.options) {
      this.buscarOpcion(valor);
    } else {
      this.cortePrestamoServ.obtenerListado()
        .subscribe({
          next: (datos: CortePrestamoModel[]) => {
            this.options = datos;

            this.crearEventoCambio();
            this.buscarOpcion(valor);
          },
          error: (error) => {
            this.utilerias.mensajeAdvertencia('ADVERTENCIA', error);
            this.cargando = false;
          }
        });
    }
  }
  @Output() codigoChange = new EventEmitter<number>();

  @Input() nombre: string;
  @Output() nombreChange = new EventEmitter<string>();
  @Output() cambio = new EventEmitter<CortePrestamoModel>();
  @Input() refrescarDatos = new EventEmitter();
  @Input() editable: boolean = true;

  constructor(@Attribute('titulo') public titulo: string,
    private cortePrestamoServ: CortePrestamoService,
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
          this.cortePrestamoServ.obtenerListado()
            .subscribe({
              next: (datos: CortePrestamoModel[]) => {
                this.options = datos;
                this.crearEventoCambio();
              },
              error: (error) => {
                this.utilerias.mensajeAdvertencia('ADVERTENCIA', error);
                this.cargando = false;
              }
            });
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
            this.cambio.emit(null);
          }

          return value;
        } else {
          let valor = value as CortePrestamoModel;

          this.noBuscar = true;

          this.codigoChange.emit(valor.nIdCorte);
          this.nombreChange.emit(valor.NombreRubro);
          this.cambio.emit(valor);

          return `Folio: ${valor.nIdCorte} ${valor.NombreRubro} ${formatDate(valor.dFechaCorte, 'yyyy-MM-dd', 'en-MX')} ${valor.bPagado ? 'PAGADO': 'NO PAGADO'} ${valor.bActivo ? 'ACTIVO': 'CANCELADO'}`;
        }
      }),
      map(name => (name ? this._filter(name) : this.options.slice())),
    );
  }

  private buscarOpcion(valor: number) {
    if (this.noBuscar) {
      this.noBuscar = false;
      this.cargando = false;
      return;
    }

    let resultado = this.options.filter(p => p.nIdCorte == valor);

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

  displayFn(opcion: CortePrestamoModel): string {
    return opcion && opcion.nIdCorte ? opcion.nIdCorte.toString() : '';
  }

  private _filter(name: string): CortePrestamoModel[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => `Folio: ${option.nIdCorte} ${option.NombreRubro} ${formatDate(option.dFechaCorte, 'yyyy-MM-dd', 'en-MX')} ${option.bPagado ? 'PAGADO' : 'NO PAGADO'} ${option.bActivo ? 'ACTIVO' : 'CANCELADO'}`.toLowerCase().includes(filterValue));
  }
}
