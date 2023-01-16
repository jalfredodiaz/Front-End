import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { TipoPrestamoModel } from 'src/app/models/tipo-prestamo/tipo-prestamo-model';
import { TipoPrestamoService } from 'src/app/services/catalogos/tipo-prestamo.service';


// Servicios
import { UtileriasService } from 'src/app/services/utilerias/utilerias.service';

@Component({
  selector: 'app-tipo-prestamo-edicion',
  templateUrl: './tipo-prestamo-edicion.component.html',
  styleUrls: ['./tipo-prestamo-edicion.component.css']
})
export class TipoPrestamoEdicionComponent implements OnInit {
  tipoPrestamo: TipoPrestamoModel;
  private tipoPrestamoOriginal: TipoPrestamoModel;
  mostrarPopup: boolean = false;

  @Output() guardado = new EventEmitter<TipoPrestamoModel>();
  @Input() mostrar = new EventEmitter<TipoPrestamoModel>();

  private subcripcionMostrar: Subscription;

  constructor(private utilerias: UtileriasService,
              private tipoPrestamoServ: TipoPrestamoService) { }

  ngOnInit(): void {
    this.subcripcionMostrar = this.mostrar.subscribe({
      next: (tipoPrestamo: TipoPrestamoModel) => {
        if (tipoPrestamo !== null) {
          // Se crea una copia del opjeto para evitar que cambios no guardados se reflejen desde
          // donde fue disparado ele vento mostrar.
          this.tipoPrestamo = Object.assign({}, tipoPrestamo);
          this.tipoPrestamoOriginal = tipoPrestamo;

          this.mostrarPopup = true;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.subcripcionMostrar.unsubscribe();
  }

  guardar() {
    if (this.tipoPrestamo.nIdRubro === 0) {
      this.tipoPrestamoServ.guardar(this.tipoPrestamo)
        .subscribe({
          next: (respuesta: number) => {
            this.tipoPrestamo.nIdRubro = respuesta;
            this.guardado.emit(this.tipoPrestamo);
            this.mostrarPopup = false;
            this.tipoPrestamo = null;
            this.tipoPrestamoOriginal = null;
          },
          error: (error) => {
            this.utilerias.mensajeAdvertencia('ADVERTENCIA', error);
          }
        });
    } else {
      this.tipoPrestamoServ.modificar(this.tipoPrestamo)
        .subscribe({
          next: () => {
            this.guardado.emit(this.tipoPrestamo);
            this.mostrarPopup = false;
            this.tipoPrestamo = null;
            this.tipoPrestamoOriginal = null;
          },
          error: (error) => {
            this.utilerias.mensajeAdvertencia('ADVERTENCIA', error);
          }
        });
    }
  }

  cancelar() {
    let conCambios: boolean = false;

    if (this.tipoPrestamo.nIdRubro !== this.tipoPrestamo.nIdRubro ||
      this.tipoPrestamo.cRubro !== this.tipoPrestamoOriginal.cRubro ||
      this.tipoPrestamo.bMensual !== this.tipoPrestamoOriginal.bMensual ||
      this.tipoPrestamo.nDiaCorte !== this.tipoPrestamoOriginal.nDiaCorte ||
      this.tipoPrestamo.nMesCorte !== this.tipoPrestamoOriginal.nMesCorte ||
      this.tipoPrestamo.bActivo !== this.tipoPrestamoOriginal.bActivo) {
      this.utilerias.mensajePregunta('IGNORAR CAMBIOS',
        'Si cierra la ventana, se perderan los cambios capturados.\n\n¿Quiere continuar?',
        'Ignorar Cambios', 'Cerrar')
        .then((ignorarCambios: boolean) => {
          if (ignorarCambios) {
            this.mostrarPopup = false;
          }
        })
    } else {
      this.mostrarPopup = false;
    }
  }
}
