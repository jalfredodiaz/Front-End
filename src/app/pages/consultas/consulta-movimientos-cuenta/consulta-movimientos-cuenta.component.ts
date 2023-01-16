import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

// Modelos
import { CuentaConMovimientosModel } from 'src/app/models/cuentas/cuenta-con-movimientos-model';
import { MovimientosCuentaModel } from 'src/app/models/cuentas/movimientos-cuenta-model';

// Servicios
import { CuentasService } from 'src/app/services/catalogos/cuentas.service';
import { UtileriasService } from 'src/app/services/utilerias/utilerias.service';

@Component({
  selector: 'app-consulta-movimientos-cuenta',
  templateUrl: './consulta-movimientos-cuenta.component.html',
  styleUrls: ['./consulta-movimientos-cuenta.component.css']
})
export class ConsultaMovimientosCuentaComponent implements OnInit {
  resultado: CuentaConMovimientosModel = new CuentaConMovimientosModel();
  totalAbonos: number = 0;
  totalCargos: number = 0;
  saldo: number = 0;


  codigoCuenta: number = 0;
  fechaIni: Date = new Date();
  fechaFin: Date = new Date();

  actualizando = false;

  displayedColumns: string[] = ['nIdMovimiento', 'Fecha', 'cTipoMovimiento', 'cCategoria', 'idReferencia', 'nIdMovimientoCancela',
    'Cargo', 'Abono', 'saldo'];

  dataSource: MatTableDataSource<MovimientosCuentaModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<MovimientosCuentaModel>;

  constructor(private cuentasServ: CuentasService,
              private utilerias: UtileriasService,
              private _liveAnnouncer: LiveAnnouncer) {
              }

  ngOnInit(): void {
    this.nuevo();
  }

  private inicializarTabla() {
    this.dataSource = new MatTableDataSource(this.resultado.Movimientos);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private sumarAbonos() {
    this.totalAbonos = this.resultado.Movimientos.map(t => t.Abono * 100000).reduce((acc, value) => acc + value, 0) / 100000;
  }

  private sumarCargos() {
    this.totalCargos = this.resultado.Movimientos.map(t => t.Cargo * 100000).reduce((acc, value) => acc + value, 0) / 100000;
  }

  private calcularSaldo() {
    this.sumarAbonos();
    this.sumarCargos();

    this.saldo = (this.resultado.SaldoInicial * 100000
                  + this.totalAbonos * 100000
                  - this.totalCargos * 100000) / 100000;
  }


  nuevo() {
    this.resultado = new CuentaConMovimientosModel();
    this.fechaIni = new Date();
    this.fechaFin = new Date();
    this.codigoCuenta = 0;
    this.totalAbonos = 0;
    this.totalCargos = 0;
    this.saldo = 0;

    this.inicializarTabla();
  }

  consultar() {
    this.cuentasServ.obtenerMovimientosCuentas(this.codigoCuenta, this.fechaIni, this.fechaFin)
      .subscribe({
        next: (respuesta: CuentaConMovimientosModel) => {
          this.resultado = respuesta;

          this.calcularSaldo();

          this.inicializarTabla();
        },
        error: (error) => {
          this.utilerias .mensajeAdvertencia('ADVERTENCIA', error);
        }
      });
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
