import { Attribute, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';


// Modelos
import { DepartamentoModel } from 'src/app/models/departamento/departamento-model';


// Servicios
import { DepartamentoService } from 'src/app/services/catalogos/departamento.service';
import { UtileriasService } from 'src/app/services/utilerias/utilerias.service';

@Component({
  selector: 'app-departamento-ayuda',
  templateUrl: './departamento-ayuda.component.html',
  styleUrls: ['./departamento-ayuda.component.css']
})
export class DepartamentoAyudaComponent implements OnInit {
  myControl = new FormControl();
  options: DepartamentoModel[];
  filteredOptions: Observable<DepartamentoModel[]>;

  public codigoSeleccionado: number;
  public nombreSeleccionado: string;

  private cargando: boolean = false;
  private noBuscar: boolean = false;

  @Input() set codigo(valor: number) {
    if (this.cargando) { return; }

    this.cargando = true;

    if (this.options) {
      this.buscarOpcion(valor);
    } else {
      this.departamentoServ.obtenerListado()
        .subscribe({
          next: (datos: DepartamentoModel[]) => {
            this.options = datos;
            this.crearEventoCambio();
            this.buscarOpcion(valor);
          },
          error: (error) => {
            this.utilerias.mensajeAdvertencia('ADVERTENCIA', error);
          }
        });
    }
  }
  @Output() codigoChange = new EventEmitter<number>();

  @Input() nombre: string;
  @Output() nombreChange = new EventEmitter<string>();
  @Output() cambio = new EventEmitter<DepartamentoModel>();

  constructor(@Attribute('titulo') public titulo: string,
              private departamentoServ: DepartamentoService,
              private utilerias: UtileriasService) {
  }

  ngOnInit() {

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

            this.nombreSeleccionado = '';
            this.codigoSeleccionado = 0;
          }

          return value;
        } else {
          let valor = value as DepartamentoModel;
          this.noBuscar = true;

          this.codigoChange.emit(valor.nIdDepartamento);
          this.nombreChange.emit(valor.cDepartamento);
          this.cambio.emit(valor);

          this.codigoSeleccionado = valor.nIdDepartamento;
          this.nombreSeleccionado = valor.cDepartamento;

          return valor.cDepartamento;
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

    let resultado = this.options.filter(p => p.nIdDepartamento == valor);

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

  displayFn(opcion: DepartamentoModel): string {
    return opcion && opcion.cDepartamento ? opcion.cDepartamento : '';
  }

  private _filter(name: string): DepartamentoModel[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.cDepartamento.toLowerCase().includes(filterValue));
  }
}
