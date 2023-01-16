import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { EscalonadoModel } from 'src/app/models/empleado/escalonado-model';
import { EmpleadoService } from 'src/app/services/catalogos/empleado.service';
import { UtileriasService } from 'src/app/services/utilerias/utilerias.service';

@Component({
  selector: 'app-consulta-escalonado',
  templateUrl: './consulta-escalonado.component.html',
  styleUrls: ['./consulta-escalonado.component.css']
})
export class ConsultaEscalonadoComponent implements OnInit {
  empleados: EscalonadoModel[] = [];

  codigoEmpleado: number = 0;
  buscando: boolean = false;

  displayedColumns: string[] = ['CodigoEmpleado', 'NombreEmpleado', 'NombrePuesto', 'NombreDepartamento', 'FechaIngreso'];
  dataSource: MatTableDataSource<EscalonadoModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<EscalonadoModel>;

  constructor(private empleadoServ: EmpleadoService,
              private utilerias: UtileriasService,
              private _liveAnnouncer: LiveAnnouncer) { }

  ngOnInit(): void {
  }

  limpiar() {
    this.codigoEmpleado = 0;
    this.empleados = [];
    this.inicializarTabla();
  }

  buscar() {
    if (this.codigoEmpleado) {
      this.empleadoServ.obtenerEmpleadosSustitutos(this.codigoEmpleado)
        .subscribe({
          next: (datos: EscalonadoModel[]) => {
            this.empleados  = datos;
            this.inicializarTabla();
          },
          error: (error) => {
            this.utilerias.mensajeAdvertencia('ADEVERTENCIA', error);
          }
        });
    } else {
      this.utilerias.mensajeInformacion('SIN EMPLEADO', 'Debe seleccionar el empleado que se ausentara.');
    }
  }


  private inicializarTabla() {
    this.dataSource = new MatTableDataSource(this.empleados);
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
