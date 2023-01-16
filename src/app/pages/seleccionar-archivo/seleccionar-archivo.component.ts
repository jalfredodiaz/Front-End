import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { UtileriasService } from 'src/app/services/utilerias/utilerias.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-seleccionar-archivo',
  templateUrl: './seleccionar-archivo.component.html',
  styleUrls: ['./seleccionar-archivo.component.css']
})
export class SeleccionarArchivoComponent implements OnInit {

  mostrarAgregarArchivo: boolean = false;
  archivoEsImagen: boolean = false;
  archivoURL: string = '';
  archivoNombre: string = '';
  archivoBlob: Blob;
  private extencionArchivo: string = '';
  private cerrando: boolean = false;

  @Output('archivoBlob') archivo = new EventEmitter<Blob>();
  @Input('mostrarPopUp') set mostrar(valor: boolean) {
    if (this.cerrando) {
      this.cerrando = false;
      return;
    }

    this.limpiarDatosArchivos();
    this.mostrarAgregarArchivo = valor;
  }
  @Output('mostrarPopUpChange') mostrarChange = new EventEmitter<boolean>();

  constructor(private utilerias: UtileriasService,
              private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

  cerrarAgregarArchivo() {
    this.mostrarAgregarArchivo = false;
    this.mostrarChange.emit(false);
  }

  limpiarDatosArchivos() {
    this.archivoBlob = null;
    this.archivoEsImagen = false;
    this.archivoNombre = '';
    this.archivoURL = '';
    this.extencionArchivo = '';
  }

  seleccionarArchivo(event) {
    let archivo: File = event.target.files[0];

    if (!archivo) { return; }

    if ('image/jpeg,image/png,application/pdf'.indexOf(archivo.type) === -1) {
      this.utilerias.mensajeAdvertencia('ARCHIVO NO PERMITIDO', 'Solo se admiten archivos con formato "JPG, PNG y PDF"');
      this.limpiarDatosArchivos();
      return;
    }

    if (archivo.size > environment.tamanoMaximoArchivoByte) {
      this.utilerias.mensajeAdvertencia('TAMAÑO DE ARCHIVO NO VALIDO',
        `El tamaño del archivo debe ser maximo de ${Math.round(environment.tamanoMaximoArchivoByte / 1024)} KB`);
      this.limpiarDatosArchivos();
      return;
    }

    this.archivoNombre = archivo.name;
    this.extencionArchivo = archivo.name.substring(archivo.name.lastIndexOf('.') + 1).toUpperCase();

    if ('JPG,JPEG,PNG'.indexOf(this.extencionArchivo) === -1) {
      this.archivoEsImagen = false;
    } else {
      this.archivoEsImagen = true;
    }

    this.archivoBlob = archivo;

    event.target.value = '';
  }

  agregarArchivo() {
    this.cerrando = true;
    this.archivo.emit(this.archivoBlob);
    this.mostrarChange.emit(false);
    this.mostrarAgregarArchivo = false;
  }
}
