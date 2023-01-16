import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

// Modelos
import { DepartamentoModel } from 'src/app/models/departamento/departamento-model';



// Servicios
import { DepartamentoService } from 'src/app/services/catalogos/departamento.service';
import { UtileriasService } from 'src/app/services/utilerias/utilerias.service';

@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.component.html',
  styleUrls: ['./departamento.component.css']
})
export class DepartamentoComponent implements OnInit {
  departamentos: DepartamentoModel[];
  private departamentoSeleccionado: DepartamentoModel;

  mostrarEdicion = new EventEmitter<DepartamentoModel>();

  displayedColumns: string[] = ['nIdDepartamento', 'cDepartamento', 'bActivo', 'accion'];
  dataSource: MatTableDataSource<DepartamentoModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<DepartamentoModel>;

  constructor(private departamentoServ: DepartamentoService,
              private utilerias: UtileriasService,
              private _liveAnnouncer: LiveAnnouncer) { }

  ngOnInit(): void {
    this.departamentoServ.obtenerListado()
      .subscribe({
        next: (respuesta: DepartamentoModel[]) => {
          this.departamentos = respuesta;

          this.inicializarTabla();
        },
        error: (error) => {
          this.utilerias.mensajeAdvertencia('ADVERTENCIA', error);
        }
      })
  }

  private inicializarTabla() {
    this.dataSource = new MatTableDataSource(this.departamentos);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private refrescar() {
    this.inicializarTabla();
    this.table.renderRows();
  }

  nuevo() {
    this.departamentoSeleccionado = new DepartamentoModel();
    this.departamentoSeleccionado.nIdDepartamento = 0;
    this.departamentoSeleccionado.cDepartamento = '';
    this.departamentoSeleccionado.bActivo = true;

    this.mostrarEdicion.emit(this.departamentoSeleccionado);
  }

  editar(departamento: DepartamentoModel) {
    this.departamentoSeleccionado = departamento;

    this.mostrarEdicion.emit(departamento);
  }

  guardado(departamento: DepartamentoModel) {
    this.utilerias.mensajeExito('GUARDADO', 'Los cambios fueron guardados correctamente.');

    this.departamentoSeleccionado.cDepartamento = departamento.cDepartamento;
    this.departamentoSeleccionado.bActivo = departamento.bActivo;

    if (this.departamentoSeleccionado.nIdDepartamento == 0) {
      this.departamentoSeleccionado.nIdDepartamento = departamento.nIdDepartamento;
      this.departamentos.push(departamento);
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
