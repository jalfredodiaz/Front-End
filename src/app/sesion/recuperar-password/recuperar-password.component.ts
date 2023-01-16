import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

// Servicios
import { AutenticacionService } from 'src/app/services/usuarios/autenticacion.service';
import { UsuarioService } from 'src/app/services/usuarios/usuario.service';
import { UtileriasService } from 'src/app/services/utilerias/utilerias.service';

@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.css']
})
export class RecuperarPasswordComponent implements OnInit {
  formaRecuperacionContrasenia: FormGroup;
  public errorSubscripcion: Subscription;
  public llaveIdenficadora: string;
  public error: string;
  public usuarioRecuperacion: string;
  public trabajando = false;

  constructor(private autService: AutenticacionService,
              private usuarioServicio: UsuarioService,
              private formRecuperacionContrasenia: FormBuilder,
              private utileriasService: UtileriasService,
              private router: Router) {
      this.crearFormularioRecuperacionContrasenia();
    }

  ngOnInit(): void {
    this.errorSubscripcion = this.autService.mensajeErrorS.subscribe((texto: string) => this.error = texto);
  }

  crearFormularioRecuperacionContrasenia() {
    this.formaRecuperacionContrasenia = this.formRecuperacionContrasenia.group({
      inputUsuario: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]]
    }, {});
  }

  validarUsuario(usuarioRecuperacion: string) {
    if (usuarioRecuperacion === '') {
      this.utileriasService.mensajeAdvertencia('ATENCIÓN', 'Escriba el usuario para la recuperación de contraseña.');
    } else if (usuarioRecuperacion.length < 5) {
      this.utileriasService.mensajeAdvertencia('ATENCIÓN', 'Usuario debe tener mínimo 5 caracteres.');
    } else {
        this.enviarCorreoRecuperacionPassword(usuarioRecuperacion);
      }
  }

  enviarCorreoRecuperacionPassword(usuarioCorreo: string) {
    this.trabajando = true;

    this.usuarioServicio.validarCorreoRecuperacion(usuarioCorreo)
      .subscribe(
        {
          next: (respuesta) => {
            const newLocal = 'MensajeUsuario';

            if (respuesta[0][newLocal] === 'CORREO_ENVIADO_RECUPERACION_CONTRASENIA') {
              this.utileriasService.mensajeExito('Correo enviado correctamente',
                'Te enviamos un mensaje al correo de recuperación que capturaste,' +
                'revisa el correo para seguir con el procedimiento de recuperación de Contraseña.');

              // this.formaRecuperacionContrasenia.reset();
              this.router.navigate(['/login']);
            } else if (respuesta[0][newLocal] === 'CORREO_ENVIADO_USUARIO') {
              this.utileriasService.mensajeExito('Correo enviado correctamente',
                'Te enviamos un mensaje al correo de recuperación de Usuario que capturaste, revisa tu correo.');
              this.router.navigate(['/login']);
            } else if (respuesta[0][newLocal] === 'CONTRASENIA_ACTIVA') {
              this.utileriasService.mensajeAdvertencia('ATENCIÓN',
                'Usted ya cuenta con un link activo para el restablecimiento de su Contraseña');
            } else if (respuesta[0][newLocal] === 'RECUPERACION_USUARIO_ACTIVO') {
              this.utileriasService.mensajeAdvertencia('ATENCIÓN', 'Usted ya solicitó recuperación de Usuario, revise su correo.');
            } else {
              this.utileriasService.mensajeAdvertencia('ATENCIÓN', 'El correo capturado no corresponde a su Usuario, verifique.');
            }

            this.trabajando = false;
          },
          error: (error) => {
            this.trabajando = false;
          }
        }
      );
  }
}
