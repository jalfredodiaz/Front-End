import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RespuestaApiModel } from 'src/app/models/respuesta-api-model';
import { UsuarioService } from 'src/app/services/usuarios/usuario.service';
import { UtileriasService } from 'src/app/services/utilerias/utilerias.service';

@Component({
  selector: 'app-nueva-password',
  templateUrl: './nueva-password.component.html',
  styleUrls: ['./nueva-password.component.css']
})
export class NuevaPasswordComponent implements OnInit {

  forma: FormGroup;
  private password: string;
  private linkNavegador: string;
  private idUsuario: string;

  constructor(private route: ActivatedRoute,
              private passNueva: UsuarioService,
              private fb: FormBuilder,
              private router: Router,
              private utileriasService: UtileriasService) {
      this.crearFormulario();
  }

  ngOnInit() {
    this.route.params
      .subscribe((parametros) => {
        if (parametros) {
          this.idUsuario = parametros['id'];
        }
      });
    // this.linkNavegador = this.route.snapshot.url.join('/'); // obtengo la ruta actual del navegador
    // this.idUsuario = this.linkNavegador.slice(39);
  }

  crearFormulario() {
    this.forma = this.fb.group({
      pass1: ['', [Validators.required, Validators.minLength(8)]],
      pass2: ['', [Validators.required, Validators.minLength(8)]]
    }, {
      validators: this.passwordsIguales('pass1', 'pass2')
    });
  }

  actualizarNuevaContrasenia() {
    if (this.forma.invalid) {
      return Object.values(this.forma.controls).forEach(control => {
        control.markAllAsTouched();
      });
    } else {
        this.actualizarPassword();
    }
  }

  private actualizarPassword() {
    this.passNueva.actualizarPassword(this.idUsuario, this.password)
      .subscribe((respuesta: RespuestaApiModel) => {
        if (respuesta.Correcto) {
          this.utileriasService.mensajeExito('Contraseña actualizada correctamente', 'Se ha actualizado la nueva contraseña.');
          this.router.navigate(['/login']);
        } else {
          this.utileriasService.mensajeAdvertencia('Atención', respuesta.Mensaje);
        }
      });
  }

  get pass1NoValido() {
    return this.forma.get('pass1').invalid && this.forma.get('pass1').touched;
  }

  get pass2NoValido() {

    const pass1 = this.forma.get('pass1').value;
    const pass2 = this.forma.get('pass2').value;

    if (pass1 === pass2) {
      this.password = pass2;
    }

    return (pass1 === pass2) ? false : true;

  }

  passwordsIguales(pass1Name: string, pass2Name: string) {
    return (formGroup: FormGroup) => {

      const pass1Control = formGroup.controls[pass1Name];
      const pass2Control = formGroup.controls[pass2Name];

      if (pass1Control.value === pass2Control.value) {
        pass2Control.setErrors(null);
      } else {
        pass2Control.setErrors({ noEsIgual: true });
      }
    };
  }
}
