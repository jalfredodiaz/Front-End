import { Component, OnInit } from '@angular/core';
import { AutenticacionService } from 'src/app/services/usuarios/autenticacion.service';
import { UsuarioLogueadoService } from 'src/app/services/usuarios/usuario-logueado.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  nick: string;
  email: string;

  mostrarCambiarImagen = false;
  mostrarCambiarPassword = false;

  constructor(public usuLogService: UsuarioLogueadoService, private autenticacionService: AutenticacionService) {
    // console.log(usuLogService.DatosUsuario);
  }

  ngOnInit(): void {
    if (this.usuLogService.DatosUsuario !== null) {
      this.nick = this.usuLogService.DatosUsuario.NombreCorto;
      this.email = this.usuLogService.DatosUsuario.Email;
    }
  }

  cerrarSesion() {
    this.autenticacionService.cerrarSesion();
  }
  cambiarImagen() {
    this.mostrarCambiarImagen = true;
  }
  cerrarCambioImagen() {
    this.mostrarCambiarImagen = false;
  }
  cambiarPassword() {
    this.mostrarCambiarPassword = true;
  }
  cerrarCambioPassword() {
    this.mostrarCambiarPassword = false;
  }
}
