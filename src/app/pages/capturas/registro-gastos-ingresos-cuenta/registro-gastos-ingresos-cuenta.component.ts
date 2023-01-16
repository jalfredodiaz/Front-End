import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { RegistroGastosIngresosModel } from 'src/app/models/cuentas/registro-gastos-ingresos-model';
import { CuentasService } from 'src/app/services/catalogos/cuentas.service';
import { UtileriasService } from 'src/app/services/utilerias/utilerias.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-registro-gastos-ingresos-cuenta',
  templateUrl: './registro-gastos-ingresos-cuenta.component.html',
  styleUrls: ['./registro-gastos-ingresos-cuenta.component.css']
})
export class RegistroGastosIngresosCuentaComponent implements OnInit {
  registro = new RegistroGastosIngresosModel();
  idCuenta: number = 0;
  esIngreso: boolean = true;
  idMovimiento: number = 0;

  editable: boolean = true;
  mostrarAgregarArchivo: boolean = false;
  guardando: boolean = false;
  cancelando: boolean = false;
  borrandoArchivo: boolean = false;
  private refrescandoDatos: boolean = false;

  refrescarDatos = new EventEmitter();

  constructor(private cuentaServ: CuentasService,
              private utilerias: UtileriasService) { }

  ngOnInit(): void {
  }

  refrescarMovimientos() {
    setTimeout(() => {
      this.refrescarDatos.emit();
    }, 50);
  }

  seleccionoMovimiento(item: RegistroGastosIngresosModel) {
    if (this.refrescandoDatos) {return;}

    if (item && item.nIdMovimiento) {
      this.registro = item;
      this.editable = false;
    } else {
      this.registro = new RegistroGastosIngresosModel();
    }
  }


  guardar() {
    if (!this.idCuenta || this.idCuenta <= 0) {
      this.utilerias.mensajeAdvertencia('SIN CUENTA', 'Debe seleccionar una cuenta.');
      return;
    }
    // console.log(this.registro.nIdCategoria);

    if (this.registro.nIdCategoria < 0) {
      this.utilerias.mensajeAdvertencia('SIN CATEGORIA', 'Debe seleccionar una categoría.');
      return;
    }

    if (this.registro.nImporte <= 0) {
      this.utilerias.mensajeAdvertencia('SIN IMPORTE', 'Debe ingresar un importe.');
      return;
    }

    if (this.idMovimiento > 0) {
      this.utilerias.mensajeAdvertencia('YA ESTA GUARDADO', 'No se permita la edición de movimiento.');
      return;
    }

    this.guardando = true;

    this.registro.nIdCuenta = this.idCuenta;

    if (this.esIngreso) {
      this.registro.nIdTipoMovimiento = environment.idTipoMovimientoIngreso;
    } else {
      this.registro.nIdTipoMovimiento = environment.idTipoMovimientoGasto;
    }

    this.cuentaServ.guardarRegistroIngresoGastos(this.registro)
      .subscribe({
        next: (id: number) => {
          this.refrescandoDatos = true;
          this.refrescarDatos.emit();
          this.guardando = false;

          this.utilerias.mensajeExito('GUARDADO', 'El movimiento se guardo correctamente.')
            .then(() => {
              setTimeout(() => {
                this.refrescandoDatos = false;
                this.editable = false;
                this.idMovimiento = id;
                // this.registro.nIdMovimiento = id;

              }, 100);
            });
        },
        error: (error) => {
          this.utilerias.mensajeAdvertencia('ADVERTENCIA', error);
          this.guardando = false;
        }
      });
  }

  nuevo() {
    this.editable = true;
    this.guardando = false;
    this.cancelando = false;
    this.registro = new RegistroGastosIngresosModel();
    this.idCuenta = 0;
    this.idMovimiento = 0;

    setTimeout(() => {
      this.refrescarDatos.emit();
    }, 20);
  }

  cancelar() {
    if (this.editable && this.registro.nIdMovimiento == 0) {
      return;
    }

    if (this.registro.Cancelado) {
      this.utilerias.mensajeInformacion('MOVIMIENTO CANCELADO', 'No es posible cancelar un registro que ya fue cancelado.');
      return;
    }

    this.utilerias.mensajePregunta('CANCELAR',
      'Esta por cancelar el registro, una vez cancelado no hay marcha atras. ¿Quiere continuar?',
      'CANCELAR', 'NO CANCELAR')
      .then((cancelar: boolean) => {
        if (cancelar) {
          this.utilerias.mensajerInput('OBSERVACIONES')
            .then((observaciones: string) => {
              this.cancelando = true;

              this.cuentaServ.cancelarRegistroIngresoGastos(this.registro.nIdMovimiento, observaciones)
                .subscribe({
                  next: (id: number) => {
                    this.cancelando = false;

                    this.utilerias.mensajeExito('CANCELADO',
                      'El registro fue cancelado generando el registro de cancelación con el folio: ' + id.toString())
                      .then(() => {
                        this.nuevo();
                      });
                  },
                  error: (error) => {
                    this.cancelando = false;
                    this.utilerias.mensajeAdvertencia('ADVERTENCIA', error);
                  }
                })
            });
        }
      });
  }

  abrirDocumento() {
    if (this.registro.cRutaDocumento) {
      this.utilerias.abrirLink(this.registro.cRutaDocumento);
    }
  }

  quitarDocumento() {
    if (this.editable || this.registro.Cancelado) { return; }

    this.utilerias.mensajePregunta('BORRAR ARCHIVO',
      'Esta por borrar definitivamente el archivo del registro.\n\n¿Quiere continuar?',
      'BORRAR', 'NO BORRAR')
      .then((borrar: boolean) => {
        if (borrar) {
          let nombreArchivo = this.registro.cRutaDocumento;

          nombreArchivo = nombreArchivo.substring(nombreArchivo.lastIndexOf('/') + 1);

          this.borrandoArchivo = true;

          this.cuentaServ.borrarArchivo(this.registro.nIdMovimiento, nombreArchivo)
            .subscribe({
              next: () => {
                this.borrandoArchivo = false;

                this.utilerias.mensajeExito('BORRADO', 'El archivo fue borrado.')
                  .then(() => {
                    this.registro.bRutaDocumento = null;
                    this.registro.cRutaDocumento = null;
                  });
              },
              error: (error) => {
                this.borrandoArchivo = false;
                this.utilerias.mensajeAdvertencia('ADVERTENCIA', error);
              }
            });
        }
      });
  }

  agregarDocumento() {
    if (this.editable) { return; }

    this.mostrarAgregarArchivo = true;
  }

  agregarArchivo(archivo: Blob) {
    if (archivo) {
      this.registro.bRutaDocumento = archivo;

      this.utilerias.mensajeTrabajando('ENVIANDO ARCHIVO', 'Se esta guardando el archivo, espere un momento por favor.');

      this.cuentaServ.guardarArchivo(archivo, this.registro.nIdMovimiento)
        .subscribe({
          next: (event) => {
            if (event instanceof HttpResponse) {
              this.registro.cRutaDocumento = event.body as string;
              this.utilerias.cerrarMensajeTrabajando();
              this.utilerias.mensajeExito('ENVIADO', 'El archivo se ha guardado.');
            }
          },
          error: (error) => {
            this.utilerias.cerrarMensajeTrabajando();
            this.utilerias.mensajeAdvertencia('ADVERTENCIA', error);
          }
        });
    }
  }
}
