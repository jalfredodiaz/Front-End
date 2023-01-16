import { Attribute, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';

// Modelos
import { TipoPrestamoModel } from 'src/app/models/tipo-prestamo/tipo-prestamo-model';


// Servicios
import { TipoPrestamoService } from 'src/app/services/catalogos/tipo-prestamo.service';
import { UtileriasService } from 'src/app/services/utilerias/utilerias.service';


@Component({
  selector: 'app-tipo-prestamo-ayuda',
  templateUrl: './tipo-prestamo-ayuda.component.html',
  styleUrls: ['./tipo-prestamo-ayuda.component.css']
})
export class TipoPrestamoAyudaComponent implements OnInit {
  myControl = new FormControl();
  options: TipoPrestamoModel[];
  filteredOptions: Observable<TipoPrestamoModel[]>;

  private cargando: boolean = false;
  private noBuscar: boolean = false;

  @Input() set codigo(valor: number) {
    if (this.cargando) { return; }

    this.cargando = true;

    if (this.options) {
      this.buscarOpcion(valor);
    } else {
      this.tipoPrestamoServ.obtenerListado()
        .subscribe({
          next: (datos: TipoPrestamoModel[]) => {
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
  @Output() cambio = new EventEmitter<TipoPrestamoModel>();
  @Input() editable: boolean = true;

  constructor(@Attribute('titulo') public titulo: string,
    private tipoPrestamoServ: TipoPrestamoService,
    private utilerias: UtileriasService) {
    // this.cargarPuestos();
  }

  ngOnInit() {

  }

  private crearEventoCambio() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        // console.log('map(value',value);

        if (typeof value === 'string') {
          if ((!value || value == null || value == '') && !this.cargando) {
            this.codigoChange.emit(0);
            this.nombreChange.emit('');
            this.cambio.emit(null);
          }

          return value;
        } else {
          let valor = value as TipoPrestamoModel;
          this.noBuscar = true;

          this.codigoChange.emit(valor.nIdRubro);
          this.nombreChange.emit(valor.cRubro);
          this.cambio.emit(valor);

          return valor.cRubro;
        }
      }),
      map(name =>
        {
          // console.log('map(name', name);
          return (name ? this._filter(name) : this.options.slice())
        }
      ),
    );
  }

  private buscarOpcion(valor: number) {
    // console.log('buscarOpcion', valor);
    // console.log('buscarOpcion noBuscar', this.noBuscar);

    if (this.noBuscar) {
      this.noBuscar = false;
      this.cargando = false;
      return;
    }

    let resultado = this.options.filter(p => p.nIdRubro == valor);

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

  displayFn(opcion: TipoPrestamoModel): string {
    return opcion && opcion.cRubro ? opcion.cRubro : '';
  }

  private _filter(name: string): TipoPrestamoModel[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.cRubro.toLowerCase().includes(filterValue));
  }
}
