import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TipoPrestamoModel } from 'src/app/models/tipo-prestamo/tipo-prestamo-model';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import * as moment from 'moment';
import 'moment/locale/es-mx';


// Modelos
import { CortePrestamoModel } from 'src/app/models/corte-prestamo/corte-prestamo-model';
import { SolicitudPrestamoModel } from 'src/app/models/solicitud-prestamo/solicitud-prestamo-model';


// Servicios
import { CortePrestamoService } from 'src/app/services/capturas/corte-prestamo.service';
import { SolicitudPrestamoService } from 'src/app/services/capturas/solicitud-prestamo.service';
import { UtileriasService } from 'src/app/services/utilerias/utilerias.service';
import { UsuarioLogueadoService } from "src/app/services/usuarios/usuario-logueado.service";


@Component({
  selector: 'app-corte-prestamo',
  templateUrl: './corte-prestamo.component.html',
  styleUrls: ['./corte-prestamo.component.css']
})
export class CortePrestamoComponent implements OnInit {
  corte: CortePrestamoModel = new CortePrestamoModel();

  imprimiendo: boolean = false;
  puedePagar: boolean = false;

  private rubro: TipoPrestamoModel;

  refrescarDatos = new EventEmitter();

  editable: boolean = true;
  @Input('corte') set mirarCorte(valor: CortePrestamoModel) {
    if (valor && valor.nIdCorte > 0) {
      this.corte = valor;

      this.obtenerPrestamosIdPorCorte();
    } else {
      setTimeout(() => {
        this.nuevo();
      }, 20);
    }

    this.editable = false;
  }
  @Output('cerrarVentana') cerrarVentana = new EventEmitter<boolean>();

  constructor(private corteServ: CortePrestamoService,
              private solicitudPrestamoServ: SolicitudPrestamoService,
              private utilerias: UtileriasService,
              private usuLog: UsuarioLogueadoService) { }

  ngOnInit(): void {
    if (this.usuLog.permisos.indexOf('CapturaCorteDePrestamos') >= 0)
    {
      this.puedePagar = true;
    } else {
      this.puedePagar = false;
    }
  }

  rubroSeleccionado(rubro: TipoPrestamoModel) {
    if (this.corte) { this.corte.Prestamos = []; }

    if (rubro && rubro.nIdRubro) {
      this.rubro = rubro;

      if (this.rubro.bAguinaldo) {
        this.calcularFechaCobroAguinaldo();
      } else {
        this.calcularFechaCobroVacaciones();
      }
    } else {
      this.rubro = null;
    }
  }

  private sumarPrestamos() {
    let suma = 0;

    this.corte.Prestamos.forEach(s => suma += s.nImporte);

    this.corte.nTotal = suma;
  }

  private calcularFechaCobroVacaciones() {
    const fechaCorte = moment();
    const diaMes = fechaCorte.date();
    let diasFaltantesPago: number = diaMes % 10;

    if (diasFaltantesPago >= 0) {
      diasFaltantesPago = 10 - diasFaltantesPago;
    }

    fechaCorte.add(diasFaltantesPago, 'day');

    this.corte.dFechaCorte = fechaCorte.toDate();
  }

  private calcularFechaCobroAguinaldo() {
    const fechaCorte = moment();

    fechaCorte.month(this.rubro.nMesCorte);
    fechaCorte.date(this.rubro.nDiaCorte);

    this.corte.dFechaCorte = fechaCorte.toDate();
  }

  private obtenerPrestamosIdPorCorte() {
    this.solicitudPrestamoServ.obtenerListadoPorIdCorte(this.corte.nIdCorte)
      .subscribe({
        next: (datos: SolicitudPrestamoModel[]) => {
          this.corte.Prestamos = datos;
        },
        error: (error) => {
          this.utilerias.mensajeAdvertencia('ADVERTENCIA', error);
        }
      })
  }

  obtenerPrestamosPorFechaCorte() {
    if (!this.corte.nIdCorte && this.corte.nIdRubro > 0) {
      this.solicitudPrestamoServ.obtenerListadoPorRubroFechaCorte(this.corte.nIdRubro, this.corte.dFechaCorte)
        .subscribe({
          next: (prestamos: SolicitudPrestamoModel[]) => {
            this.corte.Prestamos = prestamos;

            if (prestamos.length == 0) {
              this.utilerias.mensajeInformacion('INFORMACIÓN', 'No se encontraron solicitudes de prestamos a la fecha corte seleccionada.');
            }

            this.sumarPrestamos();
          },
          error: (error) => {
            this.utilerias.mensajeAdvertencia('ADVERTENCIA', error);
          }
        });
    }
  }

  folioSeleccionado(valor: CortePrestamoModel) {
    this.corte = Object.assign({}, valor);

    if (this.corte && this.corte.nIdCorte > 0) {
      // if () {
        this.obtenerPrestamosIdPorCorte();
      // }
    } else {
      this.corte = new CortePrestamoModel();
    }
  }

  imprimir() {
    if (!this.corte && !this.corte.nIdCorte && this.corte.nIdCorte <= 0) {
      return;
    }

    this.imprimiendo = true;

    this.corteServ.obtenerPDF(this.corte.nIdCorte)
      .subscribe({
        next: (respuesta) => {
          if (respuesta.type === HttpEventType.Response) {
            this.utilerias.downloadFile(respuesta as HttpResponse<Blob>, null);
            this.imprimiendo = false;
          }
        },
        error: (error) => {
          this.utilerias.mensajeAdvertencia('ADVERTENCIA', error);
          this.imprimiendo = false;
        }
      });
  }

  private limpiar() {
    this.cerrarVentana.emit(this.corte.bPagado);

    setTimeout(() => {
      this.corte = new CortePrestamoModel();
      this.refrescarDatos.emit();
    }, 20);
  }

  nuevo() {
    if (!this.corte.nIdCorte && this.corte.nIdRubro > 0) {
      this.utilerias.mensajePregunta('LIMPIAR',
        'Si limpia la pantalla, se perderan la información no guardada. \n\n¿Quiere continuar?',
        'Ignorar Cambios', 'Cancelar')
        .then((aceptar: boolean) => {
          if (aceptar) {
            this.limpiar();
          }
        });
    } else {
      this.limpiar();
    }
  }

  guardar() {
    if (!this.corte) {
      return;
    }

    if (this.corte.nIdCorte > 0) {
      return;
    } else {
      this.utilerias.mensajeTrabajando('GUARDANDO', 'Se estan guardando los datos del corte, por favor espere unos segundos.');

      this.corteServ.guardar(this.corte)
        .subscribe({
          next: (id: number) => {
            this.corte.nIdCorte = id;

            this.utilerias.cerrarMensajeTrabajando();

            this.utilerias.mensajeExito('GUARDADO', `El corte se guardado con el folio: ${id}.`)
              .then(() => {
                this.imprimir();

                setTimeout(() => {
                  this.nuevo();
                }, 50);
              });
          },
          error: (error) => {
            this.utilerias.cerrarMensajeTrabajando();

            this.utilerias.mensajeAdvertencia('ADVERTENCIA', error);
          }
        });
    }
  }

  cancelar() {
    if (!this.corte) {
      return;
    }

    if (!this.corte.nIdCorte) {
      this.utilerias.mensajeAdvertencia('DATOS INVALIDOS', 'Primero debe seleccionar un corte.');
      return;
    }

    if (this.corte.bPagado) {
      this.utilerias.mensajeAdvertencia('CORTE PAGADO', 'No se puede cancelar un corte que fue pagado.');
      return;
    }

    if (this.corte.bActivo === false) {
      this.utilerias.mensajeAdvertencia('YA CANCELADO', 'No se puede cancelar un corte cancelado.');
      return;
    }

    this.utilerias.mensajeTrabajando('CANCELANDO', 'Se esta cancelando el corte, por favor espere unos segundos.');

    this.corteServ.cancelar(this.corte.nIdCorte, this.corte.nVersion)
      .subscribe({
        next: () => {
          this.utilerias.cerrarMensajeTrabajando();

          this.utilerias.mensajeExito('CANCELADO', 'El corte fue cancelado.')
            .then(() => {
              this.nuevo();
            });
        },
        error: (error) => {
          this.utilerias.cerrarMensajeTrabajando();

          this.utilerias.mensajeAdvertencia('ADVERTENCIA', error);
        }
      })
  }

  pagar() {
    if (!this.corte) {
      return;
    }

    if (!this.corte.nIdCorte) {
      this.utilerias.mensajeAdvertencia('DATOS INVALIDOS', 'Primero debe seleccionar un corte.');
      return;
    }

    if (this.corte.nVersion == null || this.corte.nVersion == undefined) {
      this.utilerias.mensajeAdvertencia('DATOS INVALIDOS', 'Primero debe seleccionar un corte o limpie de click en limpiar y consultelo de nuevo.');
      return;
    }

    if (this.corte.bPagado) {
      this.utilerias.mensajeAdvertencia('CORTE PAGADO', 'No se puede pagar un corte que ya fue pagado.');
      return;
    }

    if (this.corte.bActivo === false) {
      this.utilerias.mensajeAdvertencia('YA CANCELADO', 'No se puede pagar un corte cancelado.');
      return;
    }

    this.utilerias.mensajeTrabajando('PAGANDO', 'Se esta pagand el corte, por favor espere unos segundos.');

    this.corteServ.pagar(this.corte.nIdCorte, this.corte.nVersion)
      .subscribe({
        next: () => {
          this.utilerias.cerrarMensajeTrabajando();

          this.utilerias.mensajeExito('PAGADO', 'El corte fue pagado.')
            .then(() => {
              this.nuevo();
            });
        },
        error: (error) => {
          this.utilerias.cerrarMensajeTrabajando();

          this.utilerias.mensajeAdvertencia('ADVERTENCIA', error);
        }
      })
  }

  cancelarPago() {
    if (!this.corte) {
      return;
    }

    if (!this.corte.nIdCorte) {
      this.utilerias.mensajeAdvertencia('DATOS INVALIDOS', 'Primero debe seleccionar un corte.');
      return;
    }

    if (this.corte.nVersion == null || this.corte.nVersion == undefined) {
      this.utilerias.mensajeAdvertencia('DATOS INVALIDOS', 'Primero debe seleccionar un corte o limpie de click en limpiar y consultelo de nuevo.');
      return;
    }

    if (!this.corte.bPagado) {
      this.utilerias.mensajeAdvertencia('CORTE NO PAGADO', 'No se puede cancelar el pago de un corte que no esta pagado.');
      return;
    }

    if (this.corte.bActivo === false) {
      this.utilerias.mensajeAdvertencia('YA CANCELADO', 'No se puede cancelar un corte cancelado.');
      return;
    }

    this.utilerias.mensajeTrabajando('CANCELANDO PAGO', 'Se esta cancelando el corte, por favor espere unos segundos.');

    this.corteServ.cancelarPagar(this.corte.nIdCorte, this.corte.nVersion)
      .subscribe({
        next: () => {
          this.utilerias.cerrarMensajeTrabajando();

          this.utilerias.mensajeExito('PAGO CANCELADO', 'El corte fue cancelado.')
            .then(() => {
              this.nuevo();
            });
        },
        error: (error) => {
          this.utilerias.cerrarMensajeTrabajando();

          this.utilerias.mensajeAdvertencia('ADVERTENCIA', error);
        }
      })
  }
}
