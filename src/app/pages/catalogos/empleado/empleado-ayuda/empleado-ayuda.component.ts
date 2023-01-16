import { Attribute, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';

// Modelos
import { EmpleadoModel } from 'src/app/models/empleado/empleado-model';

// Servicios
import { EmpleadoService } from 'src/app/services/catalogos/empleado.service';
import { UtileriasService } from 'src/app/services/utilerias/utilerias.service';

@Component({
  selector: 'app-empleado-ayuda',
  templateUrl: './empleado-ayuda.component.html',
  styleUrls: ['./empleado-ayuda.component.css']
})
export class EmpleadoAyudaComponent implements OnInit {
  myControl = new FormControl();
  options: EmpleadoModel[];
  filteredOptions: Observable<EmpleadoModel[]>;

  private cargando: boolean = false;
  private noBuscar: boolean = false;

  @Input() set codigo(valor: number) {
    // console.log('Empleado Valor', valor);
    if (this.cargando) { return; }

    // console.log('Empleado Paso', this.options);

    this.cargando = true;

    if (this.options) {
      // console.log('CODIGO BUSCAR');
      this.buscarOpcion(valor);
    } else {
      // console.log('codigo cargar');
      this.empleadoServ.obtenerListado()
        .subscribe({
          next: (datos: EmpleadoModel[]) => {
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
  @Output() cambio = new EventEmitter<EmpleadoModel>();
  @Input() editable: boolean = true;

  constructor(@Attribute('titulo') public titulo: string,
    private empleadoServ: EmpleadoService,
    private utilerias: UtileriasService) {
    // this.cargarPuestos();
  }

  ngOnInit() {

  }

  private crearEventoCambio() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        // console.log('map(value', value);

        if (typeof value === 'string') {
          if ((!value || value == null || value == '') && !this.cargando) {
            this.codigoChange.emit(0);
            this.nombreChange.emit('');
            this.cambio.emit(null);
          }

          return value;
        } else {
          let valor = value as EmpleadoModel;
          this.noBuscar = true;

          this.codigoChange.emit(valor.nCodEmpleado);
          this.nombreChange.emit(valor.cNombre);
          this.cambio.emit(valor);

          return `${valor.nCodEmpleado} - ${valor.cNombre}`;
        }
      }),
      map(name => {
        // console.log('map(name', name);
        return (name ? this._filter(name) : this.options.slice());
      }),
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

    // console.log('Empleado BuscarOpcion');

    let resultado = this.options.filter(p => p.nCodEmpleado == valor);

    // console.log('Empleado Resultado', resultado);

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

  displayFn(opcion: EmpleadoModel): string {
    return opcion && opcion.cNombre ? opcion.cNombre : '';
  }

  private _filter(name: string): EmpleadoModel[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => `${option.nCodEmpleado} - ${option.cNombre}`.toLowerCase().includes(filterValue));
  }
}
