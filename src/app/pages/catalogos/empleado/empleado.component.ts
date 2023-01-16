import { LiveAnnouncer } from '@angular/cdk/a11y';
import { formatDate } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';


import { EmpleadoModel } from 'src/app/models/empleado/empleado-model';
import { EmpleadoService } from 'src/app/services/catalogos/empleado.service';
import { UtileriasService } from 'src/app/services/utilerias/utilerias.service';
import { EmpleadoEdicionComponent } from './empleado-edicion/empleado-edicion.component';


@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css']
})
export class EmpleadoComponent implements OnInit, AfterViewInit {
  items: EmpleadoModel[];
  private itemSeleccionado: EmpleadoModel;

  mostrarEdicion = new EventEmitter<EmpleadoModel>();

  displayedColumns: string[] = ['nCodEmpleado', 'cNombre', 'cPuesto', 'cDepartamento', 'dFechaIngreso', 'bActivo', 'accion'];
  dataSource: MatTableDataSource<EmpleadoModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<EmpleadoModel>;
  @ViewChild(EmpleadoEdicionComponent) edicion: EmpleadoEdicionComponent;

  constructor(private empleadoServ: EmpleadoService,
    private utilerias: UtileriasService,
    private _liveAnnouncer: LiveAnnouncer) { }

  ngOnInit(): void {
    this.empleadoServ.obtenerListado()
      .subscribe({
        next: (respuesta: EmpleadoModel[]) => {
          this.items = respuesta;

          this.inicializarTabla();
        },
        error: (error) => {
          this.utilerias.mensajeAdvertencia('ADVERTENCIA', error);
        }
      })
  }

  ngAfterViewInit() {

  }

  private inicializarTabla() {
    this.dataSource = new MatTableDataSource(this.items);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private refrescar() {
    this.inicializarTabla();
    this.table.renderRows();
  }

  nuevo() {
    this.itemSeleccionado = new EmpleadoModel();
    this.itemSeleccionado.nCodEmpleado = 0;
    this.itemSeleccionado.cNombre = '';
    this.itemSeleccionado.nIdPuesto = 0;
    this.itemSeleccionado.cPuesto = '';
    this.itemSeleccionado.dFechaIngreso = (formatDate(new Date(), 'yyyy-MM-dd', 'en-MX', '-7') as any);
    this.itemSeleccionado.bActivo = true;

    this.mostrarEdicion.emit(this.itemSeleccionado);

    console.log(this.edicion);
    this.edicion.nuevo = true;
  }

  editar(dato: EmpleadoModel) {
    this.itemSeleccionado = null;
    this.itemSeleccionado = dato;

    this.edicion.nuevo = false;
    this.mostrarEdicion.emit(dato);
  }

  guardado(dato: EmpleadoModel) {
    this.utilerias.mensajeExito('GUARDADO', 'Los cambios fueron guardados correctamente.');

    this.itemSeleccionado.cNombre = dato.cNombre;
    this.itemSeleccionado.cPuesto = dato.cPuesto;
    this.itemSeleccionado.cDepartamento = dato.cDepartamento;
    this.itemSeleccionado.nIdDepartamento = dato.nIdDepartamento;
    this.itemSeleccionado.nIdPuesto = dato.nIdPuesto;
    this.itemSeleccionado.dFechaIngreso = dato.dFechaIngreso;
    this.itemSeleccionado.bActivo = dato.bActivo;
    this.itemSeleccionado.cObservaciones = dato.cObservaciones;
    this.itemSeleccionado.nEstatusCrecimiento = dato.nEstatusCrecimiento;

    if (this.itemSeleccionado.nCodEmpleado == 0) {
      this.itemSeleccionado.nCodEmpleado = dato.nCodEmpleado;
      this.items.push(dato);
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
