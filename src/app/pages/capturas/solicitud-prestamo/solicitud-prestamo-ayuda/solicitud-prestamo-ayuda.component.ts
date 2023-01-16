import { formatDate } from '@angular/common';
import { Attribute, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith, Subscription } from 'rxjs';


// Modelos
import { SolicitudPrestamoModel } from 'src/app/models/solicitud-prestamo/solicitud-prestamo-model';
import { SolicitudPrestamoService } from 'src/app/services/capturas/solicitud-prestamo.service';


// Servicios
import { UtileriasService } from 'src/app/services/utilerias/utilerias.service';

@Component({
  selector: 'app-solicitud-prestamo-ayuda',
  templateUrl: './solicitud-prestamo-ayuda.component.html',
  styleUrls: ['./solicitud-prestamo-ayuda.component.css']
})
export class SolicitudPrestamoAyudaComponent implements OnInit, OnDestroy {
  myControl = new FormControl();
  options: SolicitudPrestamoModel[];
  filteredOptions: Observable<SolicitudPrestamoModel[]>;

  private cargando: boolean = false;
  private refrescando: boolean = false;
  private noBuscar: boolean = false;

  private subscripcionRefrescar:  Subscription;

  @Input() set codigo(valor: number) {
    // console.log('Codigo Cargando', this.cargando);

    if (this.cargando) { return; }

    this.cargando = true;

    // console.log('Codigo Options', this.options);

    // console.log('Codigo valor', valor);

    if (this.options) {
      this.buscarOpcion(valor);
    } else {
      this.solicitudPrestamoServ.obtenerListado()
        .subscribe({
          next: (datos: SolicitudPrestamoModel[]) => {
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
  @Output() cambio = new EventEmitter<SolicitudPrestamoModel>();
  @Input() refrescarDatos = new EventEmitter();
  @Input() editable: boolean = true;

  constructor(@Attribute('titulo') public titulo: string,
              private solicitudPrestamoServ: SolicitudPrestamoService,
              private utilerias: UtileriasService) {
  }

  ngOnInit() {
    this.crearEventoRefrescar();
  }

  ngOnDestroy(): void {
    this.subscripcionRefrescar.unsubscribe();
  }

  private crearEventoRefrescar() {
    // console.log('crearEventoRefrescar');

    this.subscripcionRefrescar = this.refrescarDatos
      .subscribe({
        next: () => {
          // console.log('crearEventoRefrescar Next');
          this.cargando = true;
          this.refrescando = true;
          const valorAnt = this.myControl.value as SolicitudPrestamoModel;

          this.solicitudPrestamoServ.obtenerListado()
            .subscribe({
              next: (datos: SolicitudPrestamoModel[]) => {
                // console.log('crearEventoRefrescar Next 2');
                this.options = datos;
                this.crearEventoCambio();

                // console.log('valorAnt', valorAnt);

                setTimeout(() => {
                  this.cargando = false;
                  this.refrescando = false;

                  if (valorAnt) {
                    this.buscarOpcion(valorAnt.nIdPrestamo);
                  }
                }, 20);
              },
              error: (error) => {
                this.utilerias.mensajeAdvertencia('ADVERTENCIA', error);

                setTimeout(() => {
                  this.cargando = false;
                  this.refrescando = false;
                }, 20);
              }
            });
        }
      });
  }

  private crearEventoCambio() {
    // console.log('crearEventoCambio');

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        if (this.refrescando) { return value; }

        // console.log('crearEventoCambio value', value);

        if (typeof value === 'string') {
          if ((!value || value == null || value == '') && !this.cargando) {
            this.codigoChange.emit(0);
            this.nombreChange.emit('');
            this.cambio.emit(null);

            // console.log('cambio null');
          }

          return value;
        } else {
          let valor = value as SolicitudPrestamoModel;

          this.noBuscar = true;

          this.codigoChange.emit(valor.nIdPrestamo);
          this.nombreChange.emit(valor.NombreEmpleado);
          this.cambio.emit(valor);

          // console.log('cambio valor', valor);

          return `${valor.nIdPrestamo} ${valor.NombreEmpleado} ${valor.NombreRubro} ${formatDate(valor.dFecha_Registro, 'yyyy-MM-dd', 'en-MX')}`;
        }
      }),
      map(name => (name ? this._filter(name) : this.options.slice())),
    );
  }

  private buscarOpcion(valor: number) {
    // console.log('buscarOpcion inicio', valor);

    if (this.noBuscar) {
      this.noBuscar = false;
      this.cargando = false;
      return;
    }


    // console.log('buscarOpcion filtro', valor);

    let resultado = this.options.filter(p => p.nIdPrestamo == valor);

    // console.log('buscarOpcion resultado', resultado);

    if (resultado && resultado.length > 0) {
      // console.log('buscar opcion encontro', resultado[0]);
      this.myControl.setValue(resultado[0]);
    } else {
      // console.log('buscar opcion vacio');
      this.myControl.setValue('');
    }

    // El objetivo de esta  promesa es dar tiempo a otras operaciones desencadenadas para que tomen el valor
    // que aun sigue cargandose.
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    })
      .then((rest: boolean) => {
        this.cargando = false;
        this.noBuscar = false;
      });
  }

  displayFn(opcion: SolicitudPrestamoModel): string {
    return opcion && opcion.nIdPrestamo ? opcion.nIdPrestamo.toString() : '';
  }

  private _filter(name: string): SolicitudPrestamoModel[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => `${option.nIdPrestamo} ${option.NombreEmpleado} ${option.NombreRubro} ${formatDate(option.dFecha_Registro, 'yyyy-MM-dd', 'en-MX')}`.toLowerCase().includes(filterValue));
  }
}
