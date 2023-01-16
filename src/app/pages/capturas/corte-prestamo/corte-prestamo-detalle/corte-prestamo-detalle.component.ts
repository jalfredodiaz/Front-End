import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SolicitudPrestamoModel } from 'src/app/models/solicitud-prestamo/solicitud-prestamo-model';

@Component({
  selector: 'app-corte-prestamo-detalle',
  templateUrl: './corte-prestamo-detalle.component.html',
  styleUrls: ['./corte-prestamo-detalle.component.css']
})
export class CortePrestamoDetalleComponent implements OnInit {
  displayedColumns: string[] = ['nIdPrestamo', 'NombreEmpleado', 'dFecha_Registro', 'nImporte', 'archivos'];
  // 'dFechaCobro',
  // 'cRutaArchivoINE_Frente', 'cRutaArchivoINE_Atras', 'cRutaPagare', 'cRutaCheque'
  solicitudes: SolicitudPrestamoModel[] = [];

  @Input() set items(valor: SolicitudPrestamoModel[]) {
    if (valor) {
      this.solicitudes = valor;
    } else {
      this.solicitudes = [];
    }
  }

  constructor() { }

  ngOnInit(): void {

  }
}
