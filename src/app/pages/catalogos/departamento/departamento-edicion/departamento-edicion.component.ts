import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';


// Modelos
import { DepartamentoModel } from 'src/app/models/departamento/departamento-model';
import { DepartamentoService } from 'src/app/services/catalogos/departamento.service';
import { UtileriasService } from 'src/app/services/utilerias/utilerias.service';

@Component({
  selector: 'app-departamento-edicion',
  templateUrl: './departamento-edicion.component.html',
  styleUrls: ['./departamento-edicion.component.css']
})
export class DepartamentoEdicionComponent implements OnInit, OnDestroy {
  departamento: DepartamentoModel;
  private departamentoOriginal: DepartamentoModel;
  mostrarPopup: boolean = false;

  @Output() guardado = new EventEmitter<DepartamentoModel>();
  @Input() mostrar = new EventEmitter<DepartamentoModel>();

  private subcripcionMostrar: Subscription;

  constructor(private departamentoServ: DepartamentoService,
              private utilerias: UtileriasService) { }

  ngOnInit(): void {
    this.subcripcionMostrar = this.mostrar.subscribe({
      next: (departamento: DepartamentoModel) => {
        if (departamento !== null) {
          // Se crea una copia del opjeto para evitar que cambios no guardados se reflejen desde
          // donde fue disparado ele vento mostrar.
          if (this.departamento) {this.departamento.nIdDepartamento == null;}

          this.departamento = Object.assign({}, departamento);
          this.departamentoOriginal = departamento;

          this.mostrarPopup = true;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.subcripcionMostrar.unsubscribe();
  }

  guardar() {
    this.departamentoServ.guardarDepartamento(this.departamento)
      .subscribe({
        next: (respuesta: number) => {
          this.departamento.nIdDepartamento = respuesta;
          this.guardado.emit(this.departamento);
          this.mostrarPopup = false;
        },
        error: (error) => {
          this.utilerias.mensajeAdvertencia('ADVERTENCIA', error);
        }
      });
  }

  cancelar() {
    let conCambios: boolean = false;

    if (this.departamento.nIdDepartamento !== this.departamentoOriginal.nIdDepartamento ||
      this.departamento.cDepartamento !== this.departamentoOriginal.cDepartamento ||
      this.departamento.bActivo !== this.departamentoOriginal.bActivo) {
      this.utilerias.mensajePregunta('IGNORAR CAMBIOS',
        'Si cierra la ventana, se perderan los cambios capturados.\n\n¿Quiere continuar?',
        'Ignorar Cambios', 'Cerrar')
        .then((ignorarCambios: boolean) => {
          if (ignorarCambios) {
            this.mostrarPopup	 = false;
          }
        })
    } else {
      this.mostrarPopup = false;
    }
  }
}
