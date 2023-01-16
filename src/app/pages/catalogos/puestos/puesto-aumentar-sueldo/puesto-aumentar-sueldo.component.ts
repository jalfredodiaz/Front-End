import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';


// Componentes
import { DepartamentoAyudaComponent } from '../../departamento/departamento-ayuda/departamento-ayuda.component';

// Servicios
import { UtileriasService } from 'src/app/services/utilerias/utilerias.service';
import { PuestoService } from 'src/app/services/catalogos/puesto.service';

@Component({
  selector: 'app-puesto-aumentar-sueldo',
  templateUrl: './puesto-aumentar-sueldo.component.html',
  styleUrls: ['./puesto-aumentar-sueldo.component.css']
})
export class PuestoAumentarSueldoComponent implements OnInit, AfterViewInit {
  visible: boolean = false;
  porcentajeIncremento: number = 0;

  @ViewChild(DepartamentoAyudaComponent) departamento: DepartamentoAyudaComponent;
  @Output() onGuardado = new EventEmitter();

  constructor(private utilerias: UtileriasService,
              private puestosServ: PuestoService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.departamento.titulo = "Departamento";
    this.departamento.codigo = 0;
  }

  public mostrar() {
    this.visible = true;
    this.departamento.codigo = 0;
    this.porcentajeIncremento = 0;
  }

  public ocultar() {
    this.visible = false;
  }

  public aumentarSueldo() {
    let mensaje: string;
    let porDepartamento: boolean = true;
    let idDepartamento: number;

    console.log('Codigo Departamento', this.departamento.codigoSeleccionado);

    if (!this.departamento.codigoSeleccionado) {
      idDepartamento = 0;
    } else {
      idDepartamento = this.departamento.codigoSeleccionado;
    }

    if (idDepartamento == 0) {
      mensaje = `Esta a punto de realizar un incremento del ${this.porcentajeIncremento}% a todos los puestos.`;
      porDepartamento = false;
    } else {
      mensaje = `Esta a punto de realizar un incremento del ${this.porcentajeIncremento}% a todos los puestos del departamento ${this.departamento.nombreSeleccionado}.`;
    }

    mensaje += '\n\n¿Quiere Continuar?';

    this.utilerias.mensajePregunta('¿Incrementar Sueldo?', mensaje)
      .then((incrementar: boolean) => {
        if (incrementar) {
          if (porDepartamento) {
            this.puestosServ.aumentarSueldoPorDepartamento(idDepartamento, this.porcentajeIncremento)
              .subscribe({
                next: () => {
                  this.utilerias.mensajeExito('SUELDOS INCREMENTADOS', 'Los sueldos de los puestos fueron incrementados correctamente.')
                    .then(() => {
                      this.onGuardado.emit();
                      this.ocultar();
                    });
                },
                error: (error) => {
                  this.utilerias.mensajeAdvertencia('ADVERTENCIA', error);
                }
              });
          } else {
            this.puestosServ.aumentarSueldo(this.porcentajeIncremento)
              .subscribe({
                next: () => {
                  this.utilerias.mensajeExito('SUELDOS INCREMENTADOS', 'Los sueldos de los puestos fueron incrementados correctamente.')
                    .then(() => {
                      this.onGuardado.emit();
                      this.ocultar();
                    });
                },
                error: (error) => {
                  this.utilerias.mensajeAdvertencia('ADVERTENCIA', error);
                }
              });
          }
        }
      });
  }
}
