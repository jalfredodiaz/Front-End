import { LiveAnnouncer } from '@angular/cdk/a11y';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { EmpleadoConSueldo } from 'src/app/models/empleado/empleado-con-sueldo';
import { EmpleadoService } from 'src/app/services/catalogos/empleado.service';
import { UtileriasService } from 'src/app/services/utilerias/utilerias.service';

@Component({
  selector: 'app-consulta-empleados',
  templateUrl: './consulta-empleados.component.html',
  styleUrls: ['./consulta-empleados.component.css']
})
export class ConsultaEmpleadosComponent implements OnInit {
  empleados: EmpleadoConSueldo[];
  actualizando: boolean = false;

  filtro: string = '';

  displayedColumns: string[] = ['Codigo', 'Nombre', 'SueldoDiario', 'Puesto', 'Departamento', 'PuestoPadre'];

  dataSource: MatTableDataSource<EmpleadoConSueldo>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<EmpleadoConSueldo>;

  constructor(private empleadoServ: EmpleadoService,
    private utilerias: UtileriasService,
    private _liveAnnouncer: LiveAnnouncer) { }

  ngOnInit(): void {
    this.buscar();
  }

  buscar() {
    this.actualizando = true;
    // this.filtro = '';

    this.empleadoServ.obtenerEmpleadoConSueldo()
      .subscribe({
        next: (datos: EmpleadoConSueldo[]) => {
          this.empleados = datos;

          console.log(this.empleados);

          this.inicializarTabla();
          this.actualizando = false;
        },
        error: (error) => {
          this.utilerias.mensajeAdvertencia('ADVERTENCIA', error);
          this.actualizando = false;
        }
      });
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
