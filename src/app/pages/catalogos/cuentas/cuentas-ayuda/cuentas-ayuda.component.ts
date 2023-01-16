import { Attribute, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { CuentaModel } from 'src/app/models/cuentas/cuenta-model';
import { CuentasService } from 'src/app/services/catalogos/cuentas.service';

// Modelos

// Servicios
import { UtileriasService } from 'src/app/services/utilerias/utilerias.service';

@Component({
  selector: 'app-cuentas-ayuda',
  templateUrl: './cuentas-ayuda.component.html',
  styleUrls: ['./cuentas-ayuda.component.css']
})
export class CuentasAyudaComponent implements OnInit {
  myControl = new FormControl();
  options: CuentaModel[];
  filteredOptions: Observable<CuentaModel[]>;

  private cargando: boolean = false;
  private noBuscar: boolean = false;

  @Input() set codigo(valor: number) {
    if (this.cargando) { return; }

    this.cargando = true;

    if (this.options) {
      this.buscarOpcion(valor);
    } else {
      this.cuentasServ.obtenerCuentas()
        .subscribe({
          next: (datos: CuentaModel[]) => {
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
  @Output() cambio = new EventEmitter<CuentaModel>();

  constructor(@Attribute('titulo') public titulo: string,
    private cuentasServ: CuentasService,
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
          let valor = value as CuentaModel;
          this.noBuscar = true;

          this.codigoChange.emit(valor.nIdCuenta);
          this.nombreChange.emit(valor.cCuenta);
          this.cambio.emit(valor);

          return valor.cCuenta;
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

    let resultado = this.options.filter(p => p.nIdCuenta == valor);

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

  displayFn(opcion: CuentaModel): string {
    return opcion && opcion.cCuenta ? opcion.cCuenta : '';
  }

  private _filter(name: string): CuentaModel[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.cCuenta.toLowerCase().includes(filterValue));
  }
}
