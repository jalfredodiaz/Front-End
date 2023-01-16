import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';


// Modelos
import { SolicitudPrestamoModel } from 'src/app/models/solicitud-prestamo/solicitud-prestamo-model';


// Servicios
import { SolicitudPrestamoService } from 'src/app/services/capturas/solicitud-prestamo.service';
import { UtileriasService } from 'src/app/services/utilerias/utilerias.service';


@Component({
  selector: 'app-consulta-solicitud-prestamos',
  templateUrl: './consulta-solicitud-prestamos.component.html',
  styleUrls: ['./consulta-solicitud-prestamos.component.css']
})
export class ConsultaSolicitudPrestamosComponent implements OnInit {
  // private solicitudesTodas: SolicitudPrestamoModel[] = [];
  solicitudes: SolicitudPrestamoModel[] = [];

  fechaIni: Date = new Date();
  fechaFin: Date = new Date();
  tipoPrestamo: number = 0;
  filtro: string = '';

  actualizando = false;

  displayedColumns: string[] = ['nIdPrestamo', 'NombreEmpleado',
      'NombreRubro', 'nImporte', 'nSaldo', 'bConCorte', 'dFechaCobro', 'dFecha_Registro', 'bActivo', 'accion'];
  dataSource: MatTableDataSource<SolicitudPrestamoModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<SolicitudPrestamoModel>;
  @ViewChild('input') input: ElementRef;

  constructor(private solicitudPrestamoServ: SolicitudPrestamoService,
              private utilerias: UtileriasService,
              private _liveAnnouncer: LiveAnnouncer) { }

  ngOnInit(): void {

  }

  buscar() {
    this.actualizando = true;
    this.input.nativeElement.value = '';

    this.solicitudPrestamoServ.obtenerListado()
      .subscribe({
        next: (datos: SolicitudPrestamoModel[]) => {
          this.solicitudes = datos;

          // this.filtrar();
          this.inicializarTabla();
          this.actualizando = false;
        },
        error: (error) => {
          this.utilerias.mensajeAdvertencia('ADVERTENCIA', error);
          this.actualizando = false;
        }
      });
  }

  // filtrar() {
  //   this.solicitudes = this.solicitudesTodas;
  //   this.refrescar();

  //   this.actualizando = false;
  // }

  private inicializarTabla() {
    this.dataSource = new MatTableDataSource(this.solicitudes);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // private refrescar() {
  //   this.inicializarTabla();
  //   // this.table.renderRows();
  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort | any) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
