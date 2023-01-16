import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';


// Servicios
import { AutenticacionService } from 'src/app/services/usuarios/autenticacion.service';
import { UtileriasService } from 'src/app/services/utilerias/utilerias.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  error = '';
  password = '';
  usuario = '';
  bloquearUsuarioPassword = false;
  trabajando = false;
  recuperarPassword = false;


  private errorSubscripcion: Subscription;
  private returnUrl: string;


  constructor(private autService: AutenticacionService,
              private route: ActivatedRoute,
              private utileriasService: UtileriasService) {
    this.trabajando = false;
  }

  ngOnInit(): void {
    this.recuperarPassword = false;

    // Guardar la pagina de donde fue dirigido al login para despues de logueado dirigirlo a ella
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    // Suscribir al evento mensajeErrorS del servicio de autenticación
    this.errorSubscripcion = this.autService.mensajeErrorS
      .subscribe((texto: string) => {
        this.trabajando = false;
        this.utileriasService.mensajeAdvertencia('ADVERTENCIA', texto);
      });
  }

  ngOnDestroy() {
    // Cancelar suscripcion del evento mensajeErrorS
    this.errorSubscripcion.unsubscribe();
  }

  autenticarUsuario(form: NgForm) {
    if (!form.valid) {
      this.utileriasService.mensajeAdvertencia('Faltan Datos',
        'Debe ingresar usuario y contraseña.');
      return;
    }

    this.trabajando = true;
    this.autService.iniciarSesion(this.usuario, this.password, this.returnUrl);
  }
}
