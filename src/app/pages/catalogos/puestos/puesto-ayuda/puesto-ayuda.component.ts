import { Attribute, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';

// Modelos
import { PuestoModel } from 'src/app/models/puesto/puesto-model';


// Servicios
import { PuestoService } from 'src/app/services/catalogos/puesto.service';
import { UtileriasService } from 'src/app/services/utilerias/utilerias.service';

@Component({
  selector: 'app-puesto-ayuda',
  templateUrl: './puesto-ayuda.component.html',
  styleUrls: ['./puesto-ayuda.component.css']
})
export class PuestoAyudaComponent implements OnInit {
  myControl = new FormControl();
  options: PuestoModel[];
  filteredOptions: Observable<PuestoModel[]>;

  private cargando: boolean = false;
  private noBuscar: boolean = false;

  @Input() set codigo(valor: number) {
    // console.log('cargando', this.cargando);
    if (this.cargando) { return; }

    this.cargando = true;

    // console.log('valor', valor);

    if (this.options) {
      this.buscarOpcion(valor);
    } else {
      this.puestoServ.obtenerListado()
        .subscribe({
          next: (datos: PuestoModel[]) => {
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
  @Output() cambio = new EventEmitter<PuestoModel>();

  constructor(@Attribute('titulo') public titulo: string,
              private puestoServ: PuestoService,
              private utilerias: UtileriasService) {
    // this.cargarPuestos();
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
          }

          return value;
        } else {
          let valor = value as PuestoModel;

          this.noBuscar = true;

          this.codigoChange.emit(valor.nIdPuesto);
          this.nombreChange.emit(valor.cPuesto);
          this.cambio.emit(valor);

          return valor.cPuesto;
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

    let resultado = this.options.filter(p => p.nIdPuesto == valor);

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

  displayFn(opcion: PuestoModel): string {
    return opcion && opcion.cPuesto ? opcion.cPuesto : '';
  }

  private _filter(name: string): PuestoModel[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.cPuesto.toLowerCase().includes(filterValue));
  }
}
