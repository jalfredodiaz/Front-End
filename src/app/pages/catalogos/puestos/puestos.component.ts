import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';

// Modelos
import { PuestoModel } from 'src/app/models/puesto/puesto-model';

// Servicios
import { PuestoService } from 'src/app/services/catalogos/puesto.service';
import { UtileriasService } from 'src/app/services/utilerias/utilerias.service';
import { PuestoAumentarSueldoComponent } from './puesto-aumentar-sueldo/puesto-aumentar-sueldo.component';

@Component({
  selector: 'app-puestos',
  templateUrl: './puestos.component.html',
  styleUrls: ['./puestos.component.css']
})
export class PuestosComponent implements OnInit, OnDestroy, AfterViewInit {
  puestos: PuestoModel[];
  private puestoSeleccionado: PuestoModel;

  mostrarEdicion = new EventEmitter<PuestoModel>();

  @ViewChild(PuestoAumentarSueldoComponent) aumentoSueldo: PuestoAumentarSueldoComponent;

  displayedColumns: string[] = ['nIdPuesto', 'cPuesto', 'cDepartamento', 'nSueldo', 'bActivo', 'accion'];
  dataSource: MatTableDataSource<PuestoModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<PuestoModel>;

  private subscripcion: Subscription;

  constructor(private puestoServ: PuestoService,
              private utilerias: UtileriasService,
              private _liveAnnouncer: LiveAnnouncer) { }

  ngOnInit(): void {
    this.consultar();
  }

  ngOnDestroy(): void {
    this.subscripcion.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.aumentoSueldo.onGuardado
      .subscribe(() => {
        this.consultar();
      });
  }

  private inicializarTabla() {
    this.dataSource = new MatTableDataSource(this.puestos);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private refrescar() {
    this.inicializarTabla();
    this.table.renderRows();
  }

  private consultar() {
    if (this.subscripcion) {
      this.subscripcion.unsubscribe();
      this.subscripcion = null;
    }

    this.subscripcion = this.puestoServ.obtenerListado()
      .subscribe({
        next: (respuesta: PuestoModel[]) => {
          this.puestos = respuesta;

          this.inicializarTabla();
        },
        error: (error) => {
          this.utilerias.mensajeAdvertencia('ADVERTENCIA', error);
        }
      });
  }

  nuevo() {
    this.puestoSeleccionado = new PuestoModel();
    this.puestoSeleccionado.nIdDepartamento = 0;
    this.puestoSeleccionado.cPuesto = '';
    this.puestoSeleccionado.bActivo = true;

    this.mostrarEdicion.emit(this.puestoSeleccionado);
  }

  editar(puesto: PuestoModel) {
    this.puestoSeleccionado = null;
    this.puestoSeleccionado = puesto;

    this.mostrarEdicion.emit(puesto);
  }

  guardado(puesto: PuestoModel) {
    this.utilerias.mensajeExito('GUARDADO', 'Los cambios fueron guardados correctamente.');

    this.puestoSeleccionado.cPuesto = puesto.cPuesto;
    this.puestoSeleccionado.nIdPuestoPadre = puesto.nIdPuestoPadre;
    this.puestoSeleccionado.cPuestoPadre = puesto.cPuestoPadre;
    this.puestoSeleccionado.nIdDepartamento = puesto.nIdDepartamento;
    this.puestoSeleccionado.cDepartamento = puesto.cDepartamento;
    this.puestoSeleccionado.nSueldo = puesto.nSueldo;
    this.puestoSeleccionado.bActivo = puesto.bActivo;

    if (this.puestoSeleccionado.nIdPuesto == 0) {
      this.puestoSeleccionado.nIdPuesto = puesto.nIdPuesto;
      this.puestos.push(puesto);
      this.refrescar();
    }
  }

  aumentarSueldo() {
    this.aumentoSueldo.mostrar();
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
