import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { DepartamentoModel } from 'src/app/models/departamento/departamento-model';

// Modelos
import { PuestoModel } from 'src/app/models/puesto/puesto-model';
import { DepartamentoService } from 'src/app/services/catalogos/departamento.service';

// Servicios
import { PuestoService } from 'src/app/services/catalogos/puesto.service';
import { UtileriasService } from 'src/app/services/utilerias/utilerias.service';

@Component({
  selector: 'app-puesto-edicion',
  templateUrl: './puesto-edicion.component.html',
  styleUrls: ['./puesto-edicion.component.css']
})
export class PuestoEdicionComponent implements OnInit, OnDestroy {
  puesto: PuestoModel;
  private puestoOriginal: PuestoModel;
  mostrarPopup: boolean = false;

  @Output() guardado = new EventEmitter<PuestoModel>();
  @Input() mostrar = new EventEmitter<PuestoModel>();

  private subcripcionMostrar: Subscription;

  constructor(private puestoServ: PuestoService,
              private utilerias: UtileriasService) {
    // this.cargarDepartamentos();
  }

  ngOnInit(): void {
    this.subcripcionMostrar = this.mostrar.subscribe({
      next: (puesto: PuestoModel) => {
        if (puesto !== null) {
          // Se crea una copia del opjeto para evitar que cambios no guardados se reflejen desde
          // donde fue disparado ele vento mostrar.
          // if (this.puesto != null) { this.puesto.nIdPuestoPadre = null }

          this.puesto = Object.assign({}, puesto);
          this.puestoOriginal = puesto;

          if (this.puesto.nIdPuestoPadre == null) { this.puesto.nIdPuestoPadre = 0 }

          this.mostrarPopup = true;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.subcripcionMostrar.unsubscribe();
  }

  // private cargarDepartamentos() {
  //   this.departamentoServ.obtenerListado()
  //     .subscribe({
  //       next: (datos: DepartamentoModel[]) => {
  //         this.departamentos = datos;
  //       },
  //       error: (error) => {
  //         this.utilerias.mensajeAdvertencia('ADEVERTNCIA', error);
  //       }
  //     });
  // }

  guardar() {
    if (this.puesto.nIdPuesto === 0) {
      this.puestoServ.guardar(this.puesto)
        .subscribe({
          next: (respuesta: number) => {
            this.puesto.nIdPuesto = respuesta;
            this.guardado.emit(this.puesto);
            this.mostrarPopup = false;
            this.puesto = null;
            this.puestoOriginal = null;
          },
          error: (error) => {
            this.utilerias.mensajeAdvertencia('ADVERTENCIA', error);
          }
        });
    } else {
      this.puestoServ.modificar(this.puesto)
        .subscribe({
          next: () => {
            this.guardado.emit(this.puesto);
            this.mostrarPopup = false;
            this.puesto = null;
            this.puestoOriginal = null;
          },
          error: (error) => {
            this.utilerias.mensajeAdvertencia('ADVERTENCIA', error);
          }
        });
    }
  }

  cancelar() {
    if ( this.puesto.nIdPuesto != this.puestoOriginal.nIdPuesto ||
      this.puesto.cPuesto != this.puestoOriginal.cPuesto ||
      this.puesto.nSueldo != this.puestoOriginal.nSueldo ||
      this.puesto.nIdPuestoPadre ? this.puesto.nIdPuestoPadre : 0 != this.puestoOriginal.nIdPuestoPadre ? this.puestoOriginal.nIdPuestoPadre : 0 ||
      this.puesto.nIdDepartamento != this.puestoOriginal.nIdDepartamento ||
      this.puesto.bActivo != this.puestoOriginal.bActivo) {
      this.utilerias.mensajePregunta('IGNORAR CAMBIOS',
        'Si cierra la ventana, se perderan los cambios capturados.\n\n¿Quiere continuar?',
        'Ignorar Cambios', 'Cerrar')
        .then((ignorarCambios: boolean) => {
          if (ignorarCambios) {
            this.puesto = null;
            this.puestoOriginal = null;
            this.mostrarPopup = false;
          }
        })
    } else {
      this.puestoOriginal = null;
      this.puesto = null;
      this.mostrarPopup = false;
    }
  }
}
