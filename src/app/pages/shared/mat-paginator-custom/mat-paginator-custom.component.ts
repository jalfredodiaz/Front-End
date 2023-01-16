import { Component, OnInit } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'app-mat-paginator-custom',
  templateUrl: './mat-paginator-custom.component.html',
  styleUrls: ['./mat-paginator-custom.component.css']
})
export class MatPaginatorCustomComponent extends MatPaginatorIntl implements OnInit {
  override itemsPerPageLabel = 'Filas por página';
  override previousPageLabel = 'Página anterior';
  override nextPageLabel = 'Siguiente página';
  override firstPageLabel = 'Primer página';
  override lastPageLabel = 'Ultima página';

  constructor() { super();  }

  ngOnInit(): void {
  }

}
