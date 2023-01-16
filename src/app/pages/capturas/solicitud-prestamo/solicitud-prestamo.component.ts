import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import * as moment from 'moment';
import 'moment/locale/es-mx';


// Modelos
import { EmpleadoModel } from 'src/app/models/empleado/empleado-model';
import { SolicitudPrestamoModel } from 'src/app/models/solicitud-prestamo/solicitud-prestamo-model';
import { TipoPrestamoModel } from 'src/app/models/tipo-prestamo/tipo-prestamo-model';


// Pipes
import { FormatearNumeroPipe } from 'src/app/pipes/formatear-numero.pipe';


// Servicios
import { SolicitudPrestamoService } from 'src/app/services/capturas/solicitud-prestamo.service';
import { TabuladorAguinaldoService } from 'src/app/services/catalogos/tabulador-aguinaldo.service';
import { TabuladorVacacionesService } from 'src/app/services/catalogos/tabulador-vacaciones.service';
import { UtileriasService } from 'src/app/services/utilerias/utilerias.service';
import { SolicitudPrestamoGuardarArchivoRespuestaModel } from 'src/app/models/solicitud-prestamo/solicitud-prestamo-guardar-archivo-respuesta-model';


@Component({
  selector: 'app-solicitud-prestamo',
  templateUrl: './solicitud-prestamo.component.html',
  styleUrls: ['./solicitud-prestamo.component.css']
})
export class SolicitudPrestamoComponent implements OnInit {
  solicitud: SolicitudPrestamoModel = new SolicitudPrestamoModel();
  idSolicitud: number;

  empelado: EmpleadoModel;
  rubro: TipoPrestamoModel;

  creditoUtilizado: number;
  maximo: number = 0;
  editable: boolean = true;
  imprimiendo: boolean = false;
  guardandoINE_F: boolean = false;
  guardandoINE_A: boolean = false;
  guardandoCheque: boolean = false;
  guardandoPagare: boolean = false;
  borrandoINE_F: boolean = false;
  borrandoINE_A: boolean = false;
  borrandoCheque: boolean = false;
  borrandoPagare: boolean = false;
  mostrandoSolicitudSeleccionada: boolean = false;

  mostrarAgregarArchivo: boolean = false;
  private tipoArchivo: TipoArchivoEnum;
  refrescarDatos = new EventEmitter();

  constructor(private solicitudPrestamoServ: SolicitudPrestamoService,
              private tabuladorAguinaldoServ: TabuladorAguinaldoService,
              private tabuladorVacacionesServ: TabuladorVacacionesService,
              private utileriasService: UtileriasService) { }

  ngOnInit(): void {}

  folioSeleccionado(solicitud: SolicitudPrestamoModel){
    if ((!solicitud || !solicitud.nIdPrestamo) || solicitud == null) {
      this.solicitud = new SolicitudPrestamoModel();
      this.editable = true;
    } else {
      this.mostrandoSolicitudSeleccionada = true;

      this.solicitud = Object.assign({}, solicitud);

      if (!solicitud.bActivo) {
        this.editable = false;
        return;
      }

      if (solicitud.bConCorte) {
        this.editable = false;
        return;
      }

      this.editable = true;
    }
  }

  rubroSeleccionado(rubro: TipoPrestamoModel) {
    // console.log('rubro seleccionado', rubro);

    if (rubro && rubro.nIdRubro) {
      this.rubro = rubro;

      // Para caulcar el maximo se requiere datos del Rubro y Empleado
      if (this.empelado) {
        this.calcularMaximo();
      }
    } else {
      this.rubro = null;
      this.maximo = 0;
    }
  }

  empeladoSeleccionado(empleado: EmpleadoModel) {
    // console.log('empleado seleccionado', empleado);

    if (empleado && empleado.nCodEmpleado) {
      this.empelado = empleado;

      // Para caulcar el maximo se requiere datos del Rubro y Empleado
      if (this.rubro) {
        this.calcularMaximo();
      }
    } else {
      this.empelado = null;
      this.maximo = 0;
    }
  }


  get guardarVisible() {
    return this.solicitud.nCodEmpleado > 0 && this.solicitud.nIdRubro && this.solicitud.nImporte > 0
      && this.solicitud.bActivo && !this.solicitud.bConCorte;
  }

  get fechaCobroEditable() {
    return this.solicitud.nCodEmpleado > 0 && this.solicitud.nIdRubro
        && this.solicitud.bActivo && !this.solicitud.bConCorte;
  }


  private calcularMaximo() {
    this.solicitudPrestamoServ.obtenerCreditoUtilizado(this.solicitud.nIdPrestamo, this.solicitud.nCodEmpleado, this.solicitud.nIdRubro)
      .subscribe({
        next: (creditoUtilizado: number) => {
          this.creditoUtilizado = creditoUtilizado;

          this.obtenerMaximo()
            .then((resultado: number) => {
              resultado *= 100000;
              creditoUtilizado *= 100000;

              this.maximo = (resultado - creditoUtilizado) / 100000;

              if (!this.mostrandoSolicitudSeleccionada) {
                if (this.rubro.bAguinaldo) {
                  // this.calcualrMaximoAguinaldo();
                  this.calcularFechaCobroAguinaldo();
                } else if (this.rubro.bFunerario) {
                  // this.maximo = this.rubro.nImporteMaximo - creditoUtilizado;
                  this.calcularFechaCobroFunerario();
                } else {
                  // this.calcualrMaximoVacaciones();
                  this.calcularFechaCobroVacaciones();
                }
              } else {
                this.mostrandoSolicitudSeleccionada = false;
              }
            });
        },
        error: (error) => {
          this.maximo = 0;
          this.creditoUtilizado = 0;
          this.utileriasService.mensajeAdvertencia('ADVERTENCIA', error);
        }
      });
  }


  private calcularFechaCobroVacaciones() {
    const fechaIngreso = moment(this.empelado.dFechaIngreso);

    fechaIngreso.year(moment().year());

    const diaMes = fechaIngreso.date();
    let diasFaltantesPago: number = diaMes % 10;

    if (diasFaltantesPago >= 0) {
      diasFaltantesPago = 10 - diasFaltantesPago;
    }

    const diasEnElMes = moment().daysInMonth();

    if (diasEnElMes < 30 && diaMes > 20) {
      fechaIngreso.day(diasEnElMes);
    } else {
      fechaIngreso.add(diasFaltantesPago, 'day');
    }

    if (fechaIngreso.month() < moment().month()) {
      fechaIngreso.add(1, 'year');
    }

    this.solicitud.dFechaCobro = fechaIngreso.toDate();
  }

  private calcularFechaCobroAguinaldo() {
    this.solicitud.dFechaCobro = new Date(new Date().getFullYear(), this.rubro.nMesCorte, this.rubro.nDiaCorte);
  }

  private calcularFechaCobroFunerario() {
    const fechaIngreso = moment();

    const diaMes = fechaIngreso.date();
    let diasFaltantesPago: number = diaMes % 10;

    if (diasFaltantesPago >= 0) {
      diasFaltantesPago = 10 - diasFaltantesPago;
    }

    const diasEnElMes = moment().daysInMonth();

    if (diasEnElMes < 30 && diaMes > 20) {
      fechaIngreso.day(diasEnElMes);
    } else {
      fechaIngreso.add(diasFaltantesPago, 'day');
    }


    if (fechaIngreso.month() < moment().month()) {
      fechaIngreso.add(1, 'year');
    }

    this.solicitud.dFechaCobro = fechaIngreso.toDate();
  }

  private obtenerMaximo() {
    return new Promise((resolve) => {
      this.solicitudPrestamoServ.obtenerCreditoMaximo(this.solicitud.nCodEmpleado, this.solicitud.nIdRubro)
        .subscribe({
          next: (valor: number) => {
            resolve(valor);
          },
          error: (error) => {
            this.utileriasService.mensajeAdvertencia('ADVERTENCIA',
              'Ocurrio un error al obtener el maximo permitido');
            resolve(0);
          }
        });
    });
  }

  // private calcualrMaximoVacaciones() {
  //   const años = this.obtenerAños();

  //   this.tabuladorVacacionesServ.obtenerPorId(años)
  //     .subscribe({
  //       next: (tabulado: TabuladorVacacionesModel) => {
  //         this.maximo = Math.round(this.empelado.nSueldo * tabulado.nDiasSalario * (tabulado.nPorcPrima / 100.0)) - this.creditoUtilizado;
  //       }
  //     });
  // }

  private obtenerAños() {
    let años = this.utileriasService.calcualrAños(new Date(this.empelado.dFechaIngreso), new Date());

    return Math.round(años);
  }


  // Archivos
  agregarArchivo(archivo: Blob) {
    if (archivo) {
      this.estatusGuardandoArchivo();

      this.guardarArchivo(archivo, this.tipoArchivo)
        .then((resultado: SolicitudPrestamoGuardarArchivoRespuestaModel) => {
          this.solicitud.nVersion = resultado.NuevaVersion;

          if (this.tipoArchivo === TipoArchivoEnum.INE_F) {
            this.solicitud.bRutaArchivoINE_Frente = archivo;
            this.solicitud.cRutaArchivoINE_Frente = resultado.URL;

            return;
          }

          if (this.tipoArchivo === TipoArchivoEnum.INE_A) {
            this.solicitud.bRutaArchivoINE_Atras = archivo;
            this.solicitud.cRutaArchivoINE_Atras = resultado.URL;

            return;
          }

          if (this.tipoArchivo === TipoArchivoEnum.PAGARE) {
            this.solicitud.bRutaPagare = archivo;
            this.solicitud.cRutaPagare = resultado.URL;

            return;
          }

          if (this.tipoArchivo === TipoArchivoEnum.CHEQUE) {
            this.solicitud.bRutaCheque = archivo;
            this.solicitud.cRutaCheque = resultado.URL;

            return;
          }
        })
        .catch((mensaje: string) => {
          this.utileriasService.mensajeAdvertencia('ADVERTENCIA', mensaje);
        })
        .finally(() => {
          this.estatusGuardandoArchivo();
        });
    }
  }

  private estatusGuardandoArchivo() {
    if (this.tipoArchivo === TipoArchivoEnum.INE_F) {
      this.guardandoINE_F = !this.guardandoINE_F;
      return;
    }

    if (this.tipoArchivo === TipoArchivoEnum.INE_A) {
      this.guardandoINE_A = !this.guardandoINE_A;
      return;
    }

    if (this.tipoArchivo === TipoArchivoEnum.PAGARE) {
      this.guardandoPagare = !this.guardandoPagare;
      return;
    }

    if (this.tipoArchivo === TipoArchivoEnum.CHEQUE) {
      this.guardandoCheque = !this.guardandoCheque;
      return;
    }
  }

  private estatusBorrandoArchivo(tipoArchivo: TipoArchivoEnum) {
    if (tipoArchivo === TipoArchivoEnum.INE_F) {
      this.borrandoINE_F = !this.borrandoINE_F;
      return;
    }

    if (tipoArchivo === TipoArchivoEnum.INE_A) {
      this.borrandoINE_A = !this.borrandoINE_A;
      return;
    }

    if (tipoArchivo === TipoArchivoEnum.PAGARE) {
      this.borrandoPagare = !this.borrandoPagare;
      return;
    }

    if (tipoArchivo === TipoArchivoEnum.CHEQUE) {
      this.borrandoCheque = !this.borrandoCheque;
      return;
    }
  }


  // INE FRENTE
  quitarINE_Frente() {
    if (!this.editable || this.solicitud.cRutaArchivoINE_Frente == null) { return; }

    this.utileriasService.mensajePregunta('ELIMINAR ARCHIVO',
      'Esta por eliminar el archivo, no podra recuperarlo.\n\n¿Quiere continuar?',
      'ELIMINAR ARCHIVO', 'NO ELIMINAR')
      .then((eliminar: boolean) => {
        if (eliminar) {
          let nombreArchivo: string = this.solicitud.cRutaArchivoINE_Frente;

          nombreArchivo = nombreArchivo.substring(nombreArchivo.lastIndexOf('/')+1);

          this.estatusBorrandoArchivo(TipoArchivoEnum.INE_F);

          this.borrarArchivo(this.solicitud.nIdPrestamo, nombreArchivo, TipoArchivoEnum.INE_F)
            .then((nuevaVersion: number) => {
              this.solicitud.bRutaArchivoINE_Frente = null;
              this.solicitud.cRutaArchivoINE_Frente = null;
              this.solicitud.nVersion = nuevaVersion;
            })
            .catch((error) => {
              this.utileriasService.mensajeAdvertencia('ADVERTENCIA', error);
            })
            .finally(() => {
              this.estatusBorrandoArchivo(TipoArchivoEnum.INE_F);
            });
        }});
  }

  agegarINE_Frente() {
    if (!this.editable) { return; }

    this.tipoArchivo = TipoArchivoEnum.INE_F;
    this.mostrarAgregarArchivo = true;
  }

  abrirINE_Frente() {
    if (this.solicitud.cRutaArchivoINE_Frente) {
      this.utileriasService.abrirLink(this.solicitud.cRutaArchivoINE_Frente);
    }
  }


  // INE ATRAS
  quitarINE_Atras() {
    if (!this.editable || this.solicitud.cRutaArchivoINE_Atras == null) { return; }

    this.utileriasService.mensajePregunta('ELIMINAR ARCHIVO',
      'Esta por eliminar el archivo, no podra recuperarlo.\n\n¿Quiere continuar?',
      'ELIMINAR ARCHIVO', 'NO ELIMINAR')
      .then((eliminar: boolean) => {
        if (eliminar) {
          let nombreArchivo: string = this.solicitud.cRutaArchivoINE_Atras;

          nombreArchivo = nombreArchivo.substring(nombreArchivo.lastIndexOf('/') + 1);

          this.estatusBorrandoArchivo(TipoArchivoEnum.INE_A);

          this.borrarArchivo(this.solicitud.nIdPrestamo, nombreArchivo, TipoArchivoEnum.INE_A)
            .then((nuevaVersion: number) => {
              this.solicitud.bRutaArchivoINE_Atras = null;
              this.solicitud.cRutaArchivoINE_Atras = null;
              this.solicitud.nVersion = nuevaVersion;
            })
            .catch((error) => {
              this.utileriasService.mensajeAdvertencia('ADVERTENCIA', error);
            })
            .finally(() => {
              this.estatusBorrandoArchivo(TipoArchivoEnum.INE_A);
            });
          }
        });
  }

  agegarINE_Atras() {
    if (!this.editable) { return; }

    this.tipoArchivo = TipoArchivoEnum.INE_A;
    this.mostrarAgregarArchivo = true;
  }

  abrirINE_Atras() {
    if (this.solicitud.cRutaArchivoINE_Atras) {
      this.utileriasService.abrirLink(this.solicitud.cRutaArchivoINE_Atras);
    }
  }


  // PAGARE
  quitarPagare() {
    if (!this.editable || this.solicitud.cRutaPagare == null) { return; }

    this.utileriasService.mensajePregunta('ELIMINAR ARCHIVO',
      'Esta por eliminar el archivo, no podra recuperarlo.\n\n¿Quiere continuar?',
      'ELIMINAR ARCHIVO', 'NO ELIMINAR')
      .then((eliminar: boolean) => {
        if (eliminar) {
          let nombreArchivo: string = this.solicitud.cRutaPagare;

          nombreArchivo = nombreArchivo.substring(nombreArchivo.lastIndexOf('/') + 1);

          this.estatusBorrandoArchivo(TipoArchivoEnum.PAGARE);

          this.borrarArchivo(this.solicitud.nIdPrestamo, nombreArchivo, TipoArchivoEnum.PAGARE)
            .then((nuevaVersion: number) => {
              this.solicitud.bRutaPagare = null;
              this.solicitud.cRutaPagare = null;
              this.solicitud.nVersion = nuevaVersion;
            })
            .catch((error) => {
              this.utileriasService.mensajeAdvertencia('ADVERTENCIA', error);
            })
            .finally(() => {
              this.estatusBorrandoArchivo(TipoArchivoEnum.PAGARE);
            });
          }
        });
  }

  agregarPagare() {
    if (!this.editable) { return; }

    this.tipoArchivo = TipoArchivoEnum.PAGARE;
    this.mostrarAgregarArchivo = true;
  }

  abrirPagare() {
    if (this.solicitud.cRutaPagare) {
      this.utileriasService.abrirLink(this.solicitud.cRutaPagare);
    }
  }


  // CHEQUE
  quitarCheque() {
    if (!this.editable || this.solicitud.cRutaCheque == null) { return; }

    this.utileriasService.mensajePregunta('ELIMINAR ARCHIVO',
        'Esta por eliminar el archivo, no podra recuperarlo.\n\n¿Quiere continuar?',
        'ELIMINAR ARCHIVO', 'NO ELIMINAR')
      .then((eliminar: boolean) => {
        if (eliminar) {
          let nombreArchivo: string = this.solicitud.cRutaCheque;

          nombreArchivo = nombreArchivo.substring(nombreArchivo.lastIndexOf('/') + 1);

          this.estatusBorrandoArchivo(TipoArchivoEnum.CHEQUE);

          this.borrarArchivo(this.solicitud.nIdPrestamo, nombreArchivo, TipoArchivoEnum.CHEQUE)
            .then((nuevaVersion: number) => {
              this.solicitud.bRutaCheque = null;
              this.solicitud.cRutaCheque = null;
              this.solicitud.nVersion = nuevaVersion;
            })
            .catch((error) => {
              this.utileriasService.mensajeAdvertencia('ADVERTENCIA', error);
            })
            .finally(() => {
              this.estatusBorrandoArchivo(TipoArchivoEnum.CHEQUE);
            });
        }
      });
  }

  agregarCheque() {
    if (!this.editable) { return; }

    this.tipoArchivo = TipoArchivoEnum.CHEQUE;
    this.mostrarAgregarArchivo = true;
  }

  abrirCheque() {
    if (this.solicitud.cRutaCheque) {
      this.utileriasService.abrirLink(this.solicitud.cRutaCheque);
    }
  }




  nuevo() {
    this.solicitud = new SolicitudPrestamoModel();
    this.rubro = null;
    this.empelado = null;
    this.maximo = 0;
    this.editable = true;

    setTimeout(() => {
      this.refrescarDatos.emit();
    }, 20);
  }

  guardar() {
    if (!this.solicitud) {
      return;
    }

    if (!this.editable) {
      return;
    }

    if (!this.solicitud.nCodEmpleado || this.solicitud.nCodEmpleado <= 0) {
      this.utileriasService.mensajeAdvertencia('SIN EMPLEADO', 'Falta seleccionar un empleado.');
      return;
    }

    if (!this.solicitud.nIdRubro || this.solicitud.nIdRubro <= 0) {
      this.utileriasService.mensajeAdvertencia('SIN RUBRO', 'Falta seleccionar un rubro.');
      return;
    }

    if (!this.solicitud.nImporte || this.solicitud.nImporte <= 0) {
      this.utileriasService.mensajeAdvertencia('SIN IMPORTE', 'Falta ingresar un importe.');
      return;
    }

    if (this.solicitud.nImporte > this.maximo) {
      const formatearNumero = new FormatearNumeroPipe(this.utileriasService);

      this.utileriasService.mensajeAdvertencia('IMPORTE NO VALIDO', `El importe no debe ser mayor a ${ formatearNumero.transform(this.maximo) }.`)
      return;
    }

    this.utileriasService.mensajeTrabajando('GUARDANDO', 'Guardando solicitud de prestamo.');

    if (this.solicitud.nIdPrestamo && this.solicitud.nIdPrestamo > 0) {
      this.solicitudPrestamoServ.modificar(this.solicitud)
        .subscribe({
          next: () => {
            // this.guardarDocumentos(this.solicitud.nIdPrestamo);
            this.mensajeFinalizarGuardado();
          },
          error: (error) => {
            this.utileriasService.cerrarMensajeTrabajando();
            this.utileriasService.mensajeAdvertencia('ADVERTENCIA', error);
          }
        });
    } else {
      this.solicitudPrestamoServ.guardar(this.solicitud)
        .subscribe({
          next: (respuesta: number) => {
            this.idSolicitud = respuesta;
            this.solicitud.bActivo = true;

            // this.guardarDocumentos(respuesta);
            this.mensajeFinalizarGuardado();
          },
          error: (error)  => {
            this.utileriasService.cerrarMensajeTrabajando();
            this.utileriasService.mensajeAdvertencia('ADVERTENCIA', error);
          }
        });
    }
  }

  cancelar() {
    if (!this.editable) { return; }

    this.utileriasService.mensajePregunta('¿CANCELAR?',
      'Esta por cancelar la solicitud de prestamo, ya no podra reactivarla.\n\n¿Quiere continuar?',
      'CANCELAR', 'NO CANCELAR')
      .then((cancelar: boolean) => {
        if (cancelar) {
          this.solicitudPrestamoServ.cancelar(this.solicitud.nIdPrestamo, this.solicitud.nVersion)
            .subscribe({
              next: () => {
                // this.refrescarDatos.emit();
                this.utileriasService.mensajeExito('CANCELADO', 'La solicitud fue cancelada correctamente.')
                  .then(() => {
                    this.nuevo();
                  });
                // setTimeout(() => {

                // }, 600);
              },
              error: (error) => {
                this.utileriasService.mensajeAdvertencia('ADVERTENCIA', error);
              }
            });
        }
      });
  }

  imprimir() {
    if (!this.solicitud && !this.solicitud.nIdPrestamo && this.solicitud.nIdPrestamo <= 0) {
      return;
    }

    this.solicitudPrestamoServ.obtenerPDF(this.solicitud.nIdPrestamo)
      .subscribe({
        next: (respuesta) => {
          if (respuesta.type === HttpEventType.Response) {
            this.utileriasService.downloadFile(respuesta as HttpResponse<Blob>, null);
            this.imprimiendo = false;
          }
        },
        error: (error) => {
          this.utileriasService.mensajeAdvertencia('ADVERTENCIA', error);
          this.imprimiendo = false;
        }
      });
  }

  // private guardarDocumentos(idSolicitud: number) {
  //   let archivos: { archivo: Blob, tipo: TipoArchivoEnum, tipoStr: string }[] = [];

  //   if (this.solicitud.bRutaArchivoINE_Frente) {
  //     archivos.push({
  //       archivo: this.solicitud.bRutaArchivoINE_Frente,
  //       tipo: TipoArchivoEnum.INE_F,
  //       tipoStr: 'INE FRENTE'
  //     });
  //   }

  //   if (this.solicitud.bRutaArchivoINE_Atras) {
  //     archivos.push({
  //       archivo: this.solicitud.bRutaArchivoINE_Atras,
  //       tipo: TipoArchivoEnum.INE_A,
  //       tipoStr: 'INE ATRAS'
  //     });
  //   }

  //   if (this.solicitud.bRutaPagare) {
  //     archivos.push({
  //       archivo: this.solicitud.bRutaPagare,
  //       tipo: TipoArchivoEnum.PAGARE,
  //       tipoStr: 'PAGARE'
  //     });
  //   }

  //   if (this.solicitud.bRutaCheque) {
  //     archivos.push({
  //       archivo: this.solicitud.bRutaCheque,
  //       tipo: TipoArchivoEnum.CHEQUE,
  //       tipoStr: 'CHEQUE'
  //     });
  //   }

  //   if (archivos.length > 0) {
  //     this.enviarArchivos(archivos, 0, idSolicitud);
  //   } else {
  //     this.mensajeFinalizarGuardado();
  //   }
  // }

  private mensajeFinalizarGuardado() {
    this.refrescarDatos.emit();

    setTimeout(() => {
      this.utileriasService.mensajeExito('GUARDADO', 'La solicitud de prestamo fue guardada correctamente.')
        .then(() => {
          if (this.solicitud.Nueva) {
            setTimeout(() => {
              this.solicitud.nIdPrestamo = this.idSolicitud;
              this.solicitud.Nueva = false;

              this.imprimir();
            }, 100);
          }

          setTimeout(() => {
            this.utileriasService.cerrarMensajeTrabajando();
          }, 50);
        });
    }, 300);
  }

  // private enviarArchivos(archivos: {archivo: Blob, tipo: TipoArchivoEnum, tipoStr: string}[], index: number, idSolicitud: number){
  //   let archivo = archivos[index];

  //   // console.log('Archivo', archivo);

  //   this.utileriasService.mensajeTrabajando('GUARDANDO', 'Guardando ' + archivo.tipoStr);

  //   this.solicitudPrestamoServ.guardarArchivo(archivo.archivo, idSolicitud, archivo.tipo)
  //     .pipe(
  //       finalize(() => {
  //         index++;

  //         if (archivos.length > index) {
  //           this.enviarArchivos(archivos, index, idSolicitud);
  //         } else {
  //           this.mensajeFinalizarGuardado();
  //         }
  //       })
  //     )
  //     .subscribe({
  //       next: (event) => {
  //         if (event instanceof HttpResponse) {
  //           this.solicitud.cRutaArchivoINE_Atras = event.body as SolicitudPrestamoGuardarArchivoRespuestaModel;
  //         }
  //       },
  //       error: (error) => {
  //         this.utileriasService.cerrarMensajeTrabajando();
  //         this.utileriasService.mensajeAdvertencia('ADVERTENCIA', error);
  //       }
  //     });
  // }

  private guardarArchivo(archivo: Blob, tipo: TipoArchivoEnum) {
    return new Promise(
      (resolve: (value: SolicitudPrestamoGuardarArchivoRespuestaModel) => void,
       reject: (value: string) => void) => {
          this.solicitudPrestamoServ.guardarArchivo(archivo, this.solicitud.nIdPrestamo, tipo)
            .subscribe({
              next: (event) => {
                if (event instanceof HttpResponse) {
                  // this.utileriasService.cerrarMensajeTrabajando();
                  resolve(event.body as SolicitudPrestamoGuardarArchivoRespuestaModel);
                }
              },
              error: (error) => {
                // this.utileriasService.cerrarMensajeTrabajando();
                this.utileriasService.mensajeAdvertencia('ADVERTENCIA', error);
                reject(error);
              }
            });
        });
  }

  private borrarArchivo(idSolicitud: number, nombreArchivo, tipoArchivo: TipoArchivoEnum) {
    return new Promise(
      (resolve: (value: number) => void, reject: (value: string) => void) => {
        this.solicitudPrestamoServ.borrarArchivo(idSolicitud, nombreArchivo , tipoArchivo)
          .subscribe({
            next: (nuevaVersion: number) => {
              resolve(nuevaVersion);
            },
            error: (error) => {
              reject(error);
            }
          });
    });
  }
}

enum TipoArchivoEnum {
  INE_F = 1,
  INE_A = 2,
  PAGARE = 3,
  CHEQUE = 4
}
