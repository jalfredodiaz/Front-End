import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { UsuarioLogueadoService } from 'src/app/services/usuarios/usuario-logueado.service';
import { UsuarioService } from 'src/app/services/usuarios/usuario.service';
import { UtileriasService } from 'src/app/services/utilerias/utilerias.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cambiar-foto',
  templateUrl: './cambiar-foto.component.html',
  styleUrls: ['./cambiar-foto.component.css']
})
export class CambiarFotoComponent implements OnInit {
  public imagen = '';

  @ViewChild('inputFile') myInputFile: ElementRef;

  @Output() cerrarVentana = new EventEmitter();

  constructor(private usuarioService: UsuarioService, private utileriasService: UtileriasService,
              private usuarioLogueadoService: UsuarioLogueadoService) { }

  ngOnInit(): void {
  }

  seleccionarArchivo(event) {
    if (!event) { return; }


    let archivo: File = event.target.files[0];

    if (!archivo) { return; }

    if ('image/jpeg,image/png'.indexOf(archivo.type) === -1) {
      this.utileriasService.mensajeAdvertencia('ARCHIVO NO PERMITIDO', 'Solo se admiten imagenes con formato "JPG y PNG"');
      this.limpiarDatosArchivos();
      return;
    }

    if (archivo.size > environment.tamanoMaximoArchivoImagenPerfilByte) {
      this.utileriasService.mensajeAdvertencia('ARCHIVO NO PERMITIDO',
        `El tamaño del archivo debe ser maximo ${Math.round(environment.tamanoMaximoArchivoImagenPerfilByte / 1024)} KB`);
      this.limpiarDatosArchivos();
      return;
    }

    const render = new FileReader();

    render.readAsDataURL(archivo);

    render.onloadend = () => {
      this.imagen = render.result.toString();
    };
  }
  guardarImagen() {
    if (this.imagen === null || this.imagen.length === 0) {
      this.utileriasService.mensajeAdvertencia('SIN IMAGEN', 'Debe seleccionar una imagen.');
    } else {
      this.usuarioService.cambiarImagenPerfil(this.imagen)
        .subscribe(resultado => {
          this.usuarioLogueadoService.DatosUsuario.Foto = this.imagen;
          this.utileriasService.mensajeExito('IMAGEN GUARDADA', 'La imagen fue guardada correctamente.');
          this.cerrarVentana.emit();
          this.limpiarDatosArchivos();
        }, error => {
          this.utileriasService.mensajeError('ERROR', error);
        });
    }
  }

  limpiarDatosArchivos() {
    this.imagen = '';

    if (this.myInputFile) {
      this.myInputFile.nativeElement.value = '';
    }
  }
}
