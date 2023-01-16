import { Component, Input, OnInit } from '@angular/core';


// Modelos
import { SolicitudPrestamoHistModel } from 'src/app/models/solicitud-prestamo/solicitud-prestamo-hist-model';
import { SolicitudPrestamoService } from 'src/app/services/capturas/solicitud-prestamo.service';
import { UtileriasService } from 'src/app/services/utilerias/utilerias.service';


@Component({
  selector: 'app-solicitud-prestamo-historial',
  templateUrl: './solicitud-prestamo-historial.component.html',
  styleUrls: ['./solicitud-prestamo-historial.component.css']
})
export class SolicitudPrestamoHistorialComponent implements OnInit {
  items: SolicitudPrestamoHistModel[] = [];
  displayedColumns: string[] = ['IdPrestamo', 'NombreRubro', 'Importe', 'FechaRegistro', 'Pagado', 'Activo'];

  cargando: boolean = false;

  @Input() set codigoEmpleado(valor: number) {
    if (this.cargando) { return; }

    this.cargando = true;

    if (valor) {
      this.solicitudPrestamoServ.obtenerHistorial(valor)
        .subscribe({
          next: (datos: SolicitudPrestamoHistModel[]) => {
            this.items = datos;
            this.cargando = false;
          },
          error: (error) => {
            this.utilerias.mensajeAdvertencia('ADVERTENCIA', error);
            this.cargando = false;
          }
        });
    }
    else {
      this.items = [];

      this.cargando = false;
    }
  }

  constructor(private solicitudPrestamoServ: SolicitudPrestamoService,
              private utilerias: UtileriasService) { }

  ngOnInit(): void {

  }
}
