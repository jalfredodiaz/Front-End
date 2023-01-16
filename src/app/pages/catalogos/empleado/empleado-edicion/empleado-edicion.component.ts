import { formatDate } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { EmpleadoArchivosModel } from 'src/app/models/empleado/empleado-archivos-model';

// Modelos
import { EmpleadoModel } from 'src/app/models/empleado/empleado-model';
import { SeleccionarArchivoComponent } from 'src/app/pages/seleccionar-archivo/seleccionar-archivo.component';


// Servicios
import { EmpleadoService } from 'src/app/services/catalogos/empleado.service';
import { UtileriasService } from 'src/app/services/utilerias/utilerias.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-empleado-edicion',
  templateUrl: './empleado-edicion.component.html',
  styleUrls: ['./empleado-edicion.component.css']
})
export class EmpleadoEdicionComponent implements OnInit, AfterViewInit, OnDestroy {
  empleado: EmpleadoModel;
  private empleadoOriginal: EmpleadoModel;
  mostrarPopup: boolean = false;
  estatusCrecimiento = environment.estatusCrecimientoEmpleado;

  guardandoArchivo: boolean = false;

  @Output() guardado = new EventEmitter<EmpleadoModel>();
  @Input() mostrar = new EventEmitter<EmpleadoModel>();
  @Input() nuevo: boolean = false;

  @ViewChild(SeleccionarArchivoComponent) seleccionarArchivo: SeleccionarArchivoComponent;

  private subcripcionMostrar: Subscription;
  private subcripcionArchivo: Subscription;

  constructor(private empleadoServ: EmpleadoService,
              private utilerias: UtileriasService) {
  }

  ngAfterViewInit(): void {
    this.subcripcionArchivo = this.seleccionarArchivo.archivo
      .subscribe({
        next: (dato: Blob) => {
          if (dato) {
            this.guardarArchivo(dato)
              .then((nuevoArchivo: EmpleadoArchivosModel) => {
                this.seleccionarArchivo.mostrar = false;
                this.empleado.Archivos.push(nuevoArchivo);
              })
              .catch((error) => {
                this.seleccionarArchivo.mostrar = false;
                this.utilerias.mensajeAdvertencia('ADVERTENCIA', error);
              });
          }
        }
      });
  }

  ngOnInit(): void {
    this.subcripcionMostrar = this.mostrar.subscribe({
      next: (empleado: EmpleadoModel) => {
        if (empleado !== null) {
          // Se crea una copia del objeto para evitar que cambios no guardados se reflejen desde
          // donde fue disparado el evento mostrar.
          if (this.empleado != null) { this.empleado.nIdPuesto = null }

          this.empleado = Object.assign({}, empleado);
          this.empleadoOriginal = empleado;

          this.empleadoServ.obtenerArchivos(this.empleado.nCodEmpleado)
            .subscribe({
              next: (datos: EmpleadoArchivosModel[]) => {
                this.empleado.Archivos = datos;
              },
              error: (error) => {
                this.utilerias.mensajeAdvertencia('ADVERTENCIA', error);
              }
            });

          this.mostrarPopup = true;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.subcripcionMostrar.unsubscribe();
    this.subcripcionArchivo.unsubscribe();
  }

  guardar() {
    if (this.empleado.nCodEmpleado === null || this.empleado.nCodEmpleado <= 0) {
      this.utilerias.mensajeAdvertencia('SIN CODIGO',
        'Debe ingresar el codigo de empleado');
      return;
    }

    if (!this.empleado.cNombre || this.empleado.cNombre.trim().length <= 3) {
      this.utilerias.mensajeAdvertencia('FALTAN DATOS', 'Debe ingresar un nombre.');
      return;
    }

    if (!this.empleado.nIdPuesto || this.empleado.nIdPuesto <= 0) {
      this.utilerias.mensajeAdvertencia('FALTAN DATOS', 'Debe ingresar un puesto.');
      return;
    }

    if (this.nuevo) {
      this.empleadoServ.guardar(this.empleado)
        .subscribe({
          next: (respuesta: number) => {
            this.empleado.nCodEmpleado = respuesta;
            this.guardado.emit(this.empleado);
            this.mostrarPopup = false;
            this.empleado = null;
            this.empleadoOriginal = null;
          },
          error: (error) => {
            this.utilerias.mensajeAdvertencia('ADVERTENCIA', error);
          }
        });
    } else {
      this.empleadoServ.modificar(this.empleado)
        .subscribe({
          next: () => {
            this.guardado.emit(this.empleado);
            this.mostrarPopup = false;
            this.empleado = null;
            this.empleadoOriginal = null;
          },
          error: (error) => {
            this.utilerias.mensajeAdvertencia('ADVERTENCIA', error);
          }
        });
    }
  }

  cancelar() {
    if (this.empleado.nCodEmpleado !== this.empleadoOriginal.nCodEmpleado ||
      this.empleado.cNombre !== this.empleadoOriginal.cNombre ||
      this.empleado.nIdPuesto !== this.empleadoOriginal.nIdPuesto ||
      formatDate(this.empleado.dFechaIngreso, 'yyyy-MM-dd', 'en-MX', '-7') !== formatDate(this.empleadoOriginal.dFechaIngreso, 'yyyy-MM-dd', 'en-MX', '-7') ||
      this.empleado.bActivo !== this.empleadoOriginal.bActivo) {
      this.utilerias.mensajePregunta('IGNORAR CAMBIOS',
        'Si cierra la ventana, se perderan los cambios capturados.\n\n¿Quiere continuar?',
        'Ignorar Cambios', 'Cerrar')
        .then((ignorarCambios: boolean) => {
          if (ignorarCambios) {
            this.empleado = null;
            this.empleadoOriginal = null;
            this.mostrarPopup = false;
          }
        })
    } else {
      this.empleadoOriginal = null;
      this.empleado = null;
      this.mostrarPopup = false;
    }
  }

  agregarArchivo() {
    this.seleccionarArchivo.limpiarDatosArchivos();
    this.seleccionarArchivo.mostrar = true;
  }

  abrirArchivo(archivo: EmpleadoArchivosModel) {
    if (archivo) {
      this.utilerias.abrirLink(archivo.Ruta);
    }
  }

  private guardarArchivo(archivo: Blob) {
    return new Promise((resolve: (value: EmpleadoArchivosModel) => void, reject: (value: string) => void) => {
      this.utilerias.mensajerInput('Nombre Corto del Archivo')
        .then((descripcion: string) => {
          if (!descripcion || descripcion.trim().length === 0) {
            reject('Debe ingresar un nombre corto para el archivo');
            return;
          }

          this.guardandoArchivo = true;

          this.empleadoServ.guardarArchivo(archivo, this.empleado.nCodEmpleado, descripcion)
            .subscribe({
              next: (event) => {
                if (event instanceof HttpResponse) {
                  // this.utileriasService.cerrarMensajeTrabajando();
                  this.guardandoArchivo = false;
                  resolve(event.body as EmpleadoArchivosModel);
                }
              },
              error: (error) => {
                // this.utileriasService.cerrarMensajeTrabajando();
                // this.utilerias.mensajeAdvertencia('ADVERTENCIA', error);
                this.guardandoArchivo = false;
                reject(error);
              }
            });
        });
    });
  }

  borrarArchivo(archivo: EmpleadoArchivosModel) {
    if (archivo) {
      this.utilerias.mensajePregunta('¿BORRAR ARCHIVO?',
        `Esta a punto de eliminar permanentemente el documento ${archivo.Descripcion}.\n\n¿Quiere continuar?`)
        .then((continuar: boolean) => {
          if (continuar) {
            archivo.Borrando = true;

            this.empleadoServ.borrarArchivo(this.empleado.nCodEmpleado, archivo.Id)
              .subscribe({
                next: () =>
                {
                  archivo.Borrando = false;
                  this.empleado.Archivos = this.empleado.Archivos.filter(a => a.Id !== archivo.Id);
                },
                error: (error) => {
                  this.utilerias.mensajeAdvertencia('ADVERTENCIA', error);
                  archivo.Borrando = false;
                }
              });
          }
        });
    }
  }
}
