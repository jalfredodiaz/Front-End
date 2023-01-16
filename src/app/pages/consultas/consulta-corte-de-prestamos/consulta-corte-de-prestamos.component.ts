import { LiveAnnouncer } from '@angular/cdk/a11y';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

import { CortePrestamoModel } from 'src/app/models/corte-prestamo/corte-prestamo-model';
import { CortePrestamoService } from 'src/app/services/capturas/corte-prestamo.service';
import { UtileriasService } from 'src/app/services/utilerias/utilerias.service';

@Component({
  selector: 'app-consulta-corte-de-prestamos',
  templateUrl: './consulta-corte-de-prestamos.component.html',
  styleUrls: ['./consulta-corte-de-prestamos.component.css']
})
export class ConsultaCorteDePrestamosComponent implements OnInit {
  // private solicitudesTodas: CortePrestamoModel[] = [];
  cortes: CortePrestamoModel[] = [];

  corteSeleccionado: CortePrestamoModel = new CortePrestamoModel();

  fechaIni: Date = new Date();
  fechaFin: Date = new Date();
  cortePagado: number = 2;
  tipoPrestamo: number = 0;
  // codEmpleado: number = 0;
  filtro: string = '';

  actualizando = false;

  displayedColumns: string[] = ['nIdCorte', 'dFecha_Registro', 'fechaCorte', 'bPagado',
    'nTotal', 'bActivo', 'accion'];
    // , 'dFechaCorte'
  dataSource: MatTableDataSource<CortePrestamoModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<CortePrestamoModel>;
  // @ViewChild('input') input: ElementRef;



  cargarModal: boolean = false;
  mostrarCorte: boolean = false;
  cerrarModal = new EventEmitter();

  constructor(private corteServ: CortePrestamoService,
    private utilerias: UtileriasService,
    private _liveAnnouncer: LiveAnnouncer) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.cargarModal = true;
    }, 2000);
  }

  buscar() {
    if (!this.tipoPrestamo && this.tipoPrestamo <= 0) {
      this.utilerias.mensajeAdvertencia('FALTAN DATOS', 'Debe seleccionar un rubro.');
      return;
    }

    this.actualizando = true;
    // this.filtro = '';

    this.corteServ.obtenerListadoFiltrado(this.fechaIni, this.fechaFin, this.cortePagado, this.tipoPrestamo)
      .subscribe({
        next: (datos: CortePrestamoModel[]) => {
          this.cortes = datos;

          this.inicializarTabla();
          this.actualizando = false;
        },
        error: (error) => {
          this.utilerias.mensajeAdvertencia('ADVERTENCIA', error);
          this.actualizando = false;
        }
      });
  }

  limpiar() {
    // this.input.nativeElement.value = '';
    this.fechaIni = new Date();
    this.fechaFin = new Date();
    this.tipoPrestamo = 0;
    // this.codEmpleado = 0;
    this.cortePagado = 2;

    this.cortes = [];

    this.inicializarTabla();
  }

  verCorte(corte: CortePrestamoModel) {
    if (!corte) {
      return;
    }

    this.corteSeleccionado = corte;

    this.mostrarCorte = true;
  }

  cerrarCorte(pagado: boolean) {
    if (this.corteSeleccionado) {
      this.corteSeleccionado.bPagado = pagado;
    }

    this.mostrarCorte = false;
    this.corteSeleccionado = null;
  }

  imprimir(corte: CortePrestamoModel) {
    if (!corte) {
      return;
    }

    corte.imprimiendo = true;

    this.corteServ.obtenerPDF(corte.nIdCorte)
      .subscribe({
        next: (respuesta) => {
          if (respuesta.type === HttpEventType.Response) {
            this.utilerias.downloadFile(respuesta as HttpResponse<Blob>, null);
            corte.imprimiendo = false;
          }
        },
        error: (error) => {
          this.utilerias.mensajeAdvertencia('ADVERTENCIA', error);
          corte.imprimiendo = false;
        }
      });
  }

  private inicializarTabla() {
    this.dataSource = new MatTableDataSource(this.cortes);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

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
