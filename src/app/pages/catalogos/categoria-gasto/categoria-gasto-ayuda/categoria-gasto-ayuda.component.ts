import { Attribute, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';

// Modelos
import { CategoriaGastoModel } from 'src/app/models/categoria-gasto/categoria-gasto-model';

// Servicios
import { CategoriaGastoService } from 'src/app/services/catalogos/categoria-gasto.service';
import { UtileriasService } from 'src/app/services/utilerias/utilerias.service';

@Component({
  selector: 'app-categoria-gasto-ayuda',
  templateUrl: './categoria-gasto-ayuda.component.html',
  styleUrls: ['./categoria-gasto-ayuda.component.css']
})
export class CategoriaGastoAyudaComponent implements OnInit {
  myControl = new FormControl();
  options: CategoriaGastoModel[];
  filteredOptions: Observable<CategoriaGastoModel[]>;

  private cargando: boolean = false;
  private noBuscar: boolean = false;

  @Input() set codigo(valor: number) {
    if (this.cargando) { return; }

    this.cargando = true;

    if (this.options) {
      this.buscarOpcion(valor);
    } else {
      this.categoriaGastoServ.obtenerListado()
        .subscribe({
          next: (datos: CategoriaGastoModel[]) => {
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

  @Input() editable: boolean = true;
  @Input() nombre: string;
  @Output() nombreChange = new EventEmitter<string>();
  @Output() cambio = new EventEmitter<CategoriaGastoModel>();

  constructor(@Attribute('titulo') public titulo: string,
              private categoriaGastoServ: CategoriaGastoService,
              private utilerias: UtileriasService) { }

  ngOnInit(): void {
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
          let valor = value as CategoriaGastoModel;
          this.noBuscar = true;

          this.codigoChange.emit(valor.nIdCategoria);
          this.nombreChange.emit(valor.cCategoria);
          this.cambio.emit(valor);

          return valor.cCategoria;
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

    let resultado = this.options.filter(p => p.nIdCategoria == valor);

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

  displayFn(opcion: CategoriaGastoModel): string {
    return opcion && opcion.cCategoria ? opcion.cCategoria : '';
  }

  private _filter(name: string): CategoriaGastoModel[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.cCategoria.toLowerCase().includes(filterValue));
  }
}
