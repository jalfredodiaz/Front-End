import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Models
import { OpcionMenuModel } from 'src/app/models/usuarios/OpcionesMenu';


// Servicios
import { UsuarioService } from 'src/app/services/usuarios/usuario.service';


// Declaramos las variables para jQuery
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  public menu: OpcionMenuModel[];
  private elementoMenu: HTMLElement;

  constructor(
    // private usuLogService: UsuarioLogueadoService,
    private usuarioServices: UsuarioService,
    private router: Router
    ) {
    // this.menu = this.usuLogService.DatosUsuario.menu;
    usuarioServices.obtenerMenu()
      .subscribe((menu) => {
        this.menu = menu;
        this.crearEventoFocusMenu();
      });

    usuarioServices.obtenerPermisos();
  }

  ngOnInit() {
    // let opciones = '';

    // this.elementoMenu = document.getElementById('opcionesMenu');

    // this.menu.forEach(o => {
    //   opciones += this.crearMenu(o, 0, 1);
    // });

    // this.elementoMenu.innerHTML = opciones;
  }
  // private crearMenu(opcion: OpcionMenuModel, cantidadHijasPadre: number, nivel: number ): string {
  //   let opcionGenerada = '';
  //   let opcionesHijas = '';

  //   if (opcion.opciones != null && opcion.opciones.length > 0) {
  //     if (cantidadHijasPadre === 0) {
  //       opcionGenerada = `<li class="nav-item dropdown">
  //                           <a id="dropdownMenu${opcion.nRama}" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
  //                               class="nav-link dropdown-toggle nivel${nivel}">${opcion.cNombreRama.trim()}</a>
  //                           <ul aria-labelledby="dropdownMenu${opcion.nRama}" class="dropdown-menu border-0 shadow">
  //                               @AgregarOpciones
  //                           </ul>
  //                         </li>`;
  //       opcion.opciones.forEach(opcionHija => opcionesHijas += this.crearMenu(opcionHija, opcion.opciones.length, nivel + 1));

  //       opcionGenerada = opcionGenerada.replace('@AgregarOpciones', opcionesHijas);
  //     } else {
  //       opcionGenerada = `<li class="dropdown-submenu">
  //                           <a id="dropdownMenu${opcion.nRama}" href="#" role="button" data-toggle="dropdown" aria-haspopup="true"
  //                               aria-expanded="false" class="dropdown-item dropdown-toggle nivel${nivel}">
  //                               ${opcion.cNombreRama.trim()} <i class="fas fa-caret-right float-right"></i></a>
  //                           <ul aria-labelledby="dropdownMenu${opcion.nRama}" class="dropdown-menu border-0 shadow">
  //                               @AgregarOpciones
  //                           </ul>
  //                         </li>`;
  //       opcion.opciones.forEach(opcionHija => opcionesHijas += this.crearMenu(opcionHija, opcion.opciones.length, nivel + 1));

  //       opcionGenerada = opcionGenerada.replace('@AgregarOpciones', opcionesHijas);
  //     }
  //   } else {
  //     opcionGenerada = `<li><a class="dropdown-item pointer nivel${nivel}" (click)="irA('${opcion.cRuta}')">${opcion.cNombreRama}</a></li>`;
  //   }

  //   return opcionGenerada;
  // }
  private crearEventoFocusMenu() {
    // tslint:disable-next-line:only-arrow-functions
    $(function() {
      // -------------------------------------------------------------------------------- //
      // Funcion para detectar cuando el puntero del mouse se posisiona sobre un submenu
      // -------------------------------------------------------------------------------- //
      $('ul.dropdown-menu [data-toggle="dropdown"]').on('click', function (event) {
        // mouseover
        // click
        event.preventDefault();
        event.stopPropagation();
        // mouseover
        // Ocultar los submenus desplegados
        $(this).parents('.dropdown-menu').first().find('.show').removeClass('show');

        // Mostrar el submenu tiene el puntero del mouse
        $(this).siblings().toggleClass('show');
        // Ocultar los submenus cuando se ocultan las opciones de los submenus
        // console.log($(this).parents('.show'));
        // tslint:disable-next-line:only-arrow-functions
        $(this).parents('.show').on('hidden.bs.dropdown', function(e) {
          // console.log('OCULTAR');
          $('.dropdown-submenu .show').removeClass('show');
        });
        // $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function (e) {
        //   $('.dropdown-submenu .show').removeClass('show');
        // });
      });
      // -------------------------------------------------------------------------------- //
      // Funcion para detectar cuando el puntero del mouse se posisiona sobre un submenu
      // -------------------------------------------------------------------------------- //
      $('ul.dropdown-menu [data-toggle="dropdown"]').on('mouseover', function (event) {
        // mouseover
        // click
        event.preventDefault();
        event.stopPropagation();
        // mouseover
        // Ocultar los submenus desplegados
        $(this).parents('.dropdown-menu').first().find('.show').removeClass('show');

        // Mostrar el submenu tiene el puntero del mouse
        $(this).siblings().toggleClass('show');
        // Ocultar los submenus cuando se ocultan las opciones de los submenus
        // console.log($(this).parents('.show'));
        // tslint:disable-next-line:only-arrow-functions
        $(this).parents('.show').on('hidden.bs.dropdown', function (e) {
          // console.log('OCULTAR');
          $('.dropdown-submenu .show').removeClass('show');
        });
        // $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function (e) {
        //   $('.dropdown-submenu .show').removeClass('show');
        // });
      });
    });
  }
  abrirOpcion(ruta: string) {
    this.router.navigate([ruta]);
  }
}
