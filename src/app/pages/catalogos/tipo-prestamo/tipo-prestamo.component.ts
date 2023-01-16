import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { TipoPrestamoModel } from 'src/app/models/tipo-prestamo/tipo-prestamo-model';
import { TipoPrestamoService } from 'src/app/services/catalogos/tipo-prestamo.service';


// Servicios
import { UtileriasService } from 'src/app/services/utilerias/utilerias.service';

@Component({
  selector: 'app-tipo-prestamo',
  templateUrl: './tipo-prestamo.component.html',
  styleUrls: ['./tipo-prestamo.component.css']
})
export class TipoPrestamoComponent implements OnInit {
  tipoPrestamos: TipoPrestamoModel[];
  private tipoPrestamoSeleccionado: TipoPrestamoModel;

  mostrarEdicion = new EventEmitter<TipoPrestamoModel>();

  displayedColumns: string[] = ['nIdRubro', 'cRubro', 'bActivo', 'accion'];
  dataSource: MatTableDataSource<TipoPrestamoModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<TipoPrestamoModel>;

  constructor(private tipoPrestamoServ: TipoPrestamoService,
    private utilerias: UtileriasService,
    private _liveAnnouncer: LiveAnnouncer) { }

  ngOnInit(): void {
    this.tipoPrestamoServ.obtenerListado()
      .subscribe({
        next: (respuesta: TipoPrestamoModel[]) => {
          this.tipoPrestamos = respuesta;

          this.inicializarTabla();
        },
        error: (error) => {
          this.utilerias.mensajeAdvertencia('ADVERTENCIA', error);
        }
      })
  }

  private inicializarTabla() {
    this.dataSource = new MatTableDataSource(this.tipoPrestamos);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private refrescar() {
    this.inicializarTabla();
    this.table.renderRows();
  }

  nuevo() {
    this.tipoPrestamoSeleccionado = new TipoPrestamoModel();
    this.tipoPrestamoSeleccionado.nIdRubro = 0;
    this.tipoPrestamoSeleccionado.cRubro = '';
    this.tipoPrestamoSeleccionado.bActivo = true;
    this.tipoPrestamoSeleccionado.bMensual = true;
    this.tipoPrestamoSeleccionado.nDiaCorte = 0;
    this.tipoPrestamoSeleccionado.nMesCorte = 0;

    this.mostrarEdicion.emit(this.tipoPrestamoSeleccionado);
  }

  editar(departamento: TipoPrestamoModel) {
    this.tipoPrestamoSeleccionado = departamento;

    this.mostrarEdicion.emit(departamento);
  }

  guardado(tipoPrestamo: TipoPrestamoModel) {
    this.utilerias.mensajeExito('GUARDADO', 'Los cambios fueron guardados correctamente.');

    this.tipoPrestamoSeleccionado.cRubro = tipoPrestamo.cRubro;
    this.tipoPrestamoSeleccionado.bMensual = tipoPrestamo.bMensual;
    this.tipoPrestamoSeleccionado.nDiaCorte = tipoPrestamo.nDiaCorte;
    this.tipoPrestamoSeleccionado.nMesCorte = tipoPrestamo.nMesCorte;
    this.tipoPrestamoSeleccionado.bActivo = tipoPrestamo.bActivo;

    if (this.tipoPrestamoSeleccionado.nIdRubro == 0) {
      this.tipoPrestamoSeleccionado.nIdRubro = tipoPrestamo.nIdRubro;
      this.tipoPrestamos.push(tipoPrestamo);
      this.refrescar();
    }
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
