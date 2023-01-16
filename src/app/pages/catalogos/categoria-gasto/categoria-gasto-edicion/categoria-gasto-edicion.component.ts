import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';


// Modelos
import { CategoriaGastoModel } from 'src/app/models/categoria-gasto/categoria-gasto-model';
import { CategoriaGastoService } from 'src/app/services/catalogos/categoria-gasto.service';
import { UtileriasService } from 'src/app/services/utilerias/utilerias.service';


@Component({
  selector: 'app-categoria-gasto-edicion',
  templateUrl: './categoria-gasto-edicion.component.html',
  styleUrls: ['./categoria-gasto-edicion.component.css']
})
export class CategoriaGastoEdicionComponent implements OnInit, OnDestroy {
  categoria: CategoriaGastoModel;
  private categoriaOrigina: CategoriaGastoModel;

  mostrarCategoria: boolean = false;

  @Output() guardado = new EventEmitter<CategoriaGastoModel>();
  @Input() mostrar = new EventEmitter<CategoriaGastoModel>();

  private subcripcionMostrar: Subscription;

  constructor(private utilerias: UtileriasService,
              private categoriaServ: CategoriaGastoService) { }

  ngOnInit(): void {
    this.subcripcionMostrar = this.mostrar.subscribe({
      next: (categoria: CategoriaGastoModel) => {
        if (categoria !== null) {
          // Se crea una copia del opjeto para evitar que cambios no guardados se reflejen desde
          // donde fue disparado ele vento mostrar.
          this.categoria = Object.assign({}, categoria);
          this.categoriaOrigina = categoria;

          this.mostrarCategoria = true;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.subcripcionMostrar.unsubscribe();
  }

  guardar() {
    this.categoriaServ.guardarCategoria(this.categoria)
      .subscribe({
        next: (respuesta: number) => {
          this.categoria.nIdCategoria = respuesta;
          this.guardado.emit(this.categoria);
          this.mostrarCategoria = false;
        },
        error: (error) => {
          this.utilerias.mensajeAdvertencia('ADVERTENCIA', error);
        }
      });
  }

  cancelar() {
    let conCambios: boolean = false;

    if (this.categoria.nIdCategoria !== this.categoriaOrigina.nIdCategoria ||
        this.categoria.cCategoria !== this.categoriaOrigina.cCategoria ||
        this.categoria.bActivo !== this.categoriaOrigina.bActivo) {
      this.utilerias.mensajePregunta('IGNORAR CAMBIOS',
        'Si cierra la ventana, se perderan los cambios capturados.\n\n¿Quiere continuar?',
        'Ignorar Cambios', 'Cerrar')
        .then((ignorarCambios: boolean) => {
          if (ignorarCambios) {
            this.mostrarCategoria = false;
          }
        })
    } else {
      this.mostrarCategoria = false;
    }
  }
}
