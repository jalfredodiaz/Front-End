import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioLogueadoService } from 'src/app/services/usuarios/usuario-logueado.service';
import { UsuarioService } from 'src/app/services/usuarios/usuario.service';
import { UtileriasService } from 'src/app/services/utilerias/utilerias.service';

@Component({
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.component.html',
  styleUrls: ['./cambiar-password.component.css']
})
export class CambiarPasswordComponent implements OnInit {
  usuario: string;
  passwordActual: string;
  passwordNuevo: string;
  passwordConfirmar: string;
  error: string;

  // se utiliza para estar limpiando los datos cada ves que se oculta o se muestra
  @Input() set mostrar(valor: boolean) {
    this.limpiar();
  }
  @Output() cerrarVentana = new EventEmitter();

  @ViewChild('cambiarPass') form: FormGroup;

  constructor(private usuService: UsuarioService, private router: Router,
    private utileriasService: UtileriasService,
    private usuarioLogueadoService: UsuarioLogueadoService) {
    this.usuario = this.usuarioLogueadoService.DatosUsuario.Login;
}

  ngOnInit(): void {
  }

  limpiar() {
    this.passwordActual = '';
    this.passwordNuevo = '';
    this.passwordConfirmar = '';
    this.error = '';

    if (this.form) {
      this.form.reset();
    }
  }

  cambiarPassword(form: NgForm) {
    if (!form.valid) {
      return;
    }

    this.usuService.cambiarPassword(this.passwordActual, this.passwordNuevo)
      .subscribe(
        {
          next: () => {
            this.utileriasService.mensajeExito('CONTRASEÑA CAMBIADA', 'La contraseña fue cambiada correctamente.');
            this.cerrarVentana.emit();
            this.limpiar();
          },
          error: (error) => {
            this.utileriasService.mensajeError('ERROR', error);
          }
        }
      );
  }

  cerrar() {
    // this.router.navigate(['/inicio']);
    this.cerrarVentana.emit();
    this.limpiar();
  }
}
