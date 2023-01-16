import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';


// Modelos
import { CategoriaGastoModel } from 'src/app/models/categoria-gasto/categoria-gasto-model';



// Servicios
import { CategoriaGastoService } from 'src/app/services/catalogos/categoria-gasto.service';
import { UtileriasService } from 'src/app/services/utilerias/utilerias.service';

@Component({
  selector: 'app-categoria-gasto',
  templateUrl: './categoria-gasto.component.html',
  styleUrls: ['./categoria-gasto.component.css']
})
export class CategoriaGastoComponent implements OnInit {
  categorias: CategoriaGastoModel[];
  categoriaSeleccionada: CategoriaGastoModel;

  editando = false;
  nueva = false;

  mostrarCategoria = new EventEmitter<CategoriaGastoModel>();

  displayedColumns: string[] = ['nIdCategoria', 'cCategoria', 'bActivo', 'accion'];
  dataSource: MatTableDataSource<CategoriaGastoModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<CategoriaGastoModel>;

  constructor(private categoriaServ: CategoriaGastoService,
              private utilerias: UtileriasService,
              private _liveAnnouncer: LiveAnnouncer) {

  }

  ngOnInit(): void {
    this.categoriaServ.obtenerListado()
      .subscribe({
        next: (respuesta: CategoriaGastoModel[]) => {
          this.categorias = respuesta;
          this.inicializarTabla();
        },
        error: (error) => {
          this.utilerias.mensajeAdvertencia('ADVERTENCIA', error);
        }
      });
  }

  nuevo() {
    this.categoriaSeleccionada = new CategoriaGastoModel();
    this.categoriaSeleccionada.nIdCategoria = 0;
    this.categoriaSeleccionada.cCategoria = '';
    this.categoriaSeleccionada.bActivo = true;

    this.mostrarCategoria.emit(this.categoriaSeleccionada);
  }
  editar(seleccion: CategoriaGastoModel) {
    this.categoriaSeleccionada = seleccion;

    this.mostrarCategoria.emit(this.categoriaSeleccionada);
  }
  categoriaGuardada(categoria: CategoriaGastoModel) {
    this.utilerias.mensajeExito('GUARDADA', 'Los cambios fueron guardados correctamente.');

    this.categoriaSeleccionada.cCategoria = categoria.cCategoria;
    this.categoriaSeleccionada.bActivo = categoria.bActivo;

    if (this.categoriaSeleccionada.nIdCategoria == 0) {
      this.categoriaSeleccionada.nIdCategoria = categoria.nIdCategoria;
      this.categorias.push(categoria);

      this.refrescar();
    }
  }

  private inicializarTabla() {
    this.dataSource = new MatTableDataSource(this.categorias);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private refrescar() {
    this.inicializarTabla();
    this.table.renderRows();
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
