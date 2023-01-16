import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionarArchivoComponent } from './seleccionar-archivo.component';

describe('SeleccionarArchivoComponent', () => {
  let component: SeleccionarArchivoComponent;
  let fixture: ComponentFixture<SeleccionarArchivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeleccionarArchivoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeleccionarArchivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
