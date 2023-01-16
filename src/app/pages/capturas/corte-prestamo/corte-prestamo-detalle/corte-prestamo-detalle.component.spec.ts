import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CortePrestamoDetalleComponent } from './corte-prestamo-detalle.component';

describe('CortePrestamoDetalleComponent', () => {
  let component: CortePrestamoDetalleComponent;
  let fixture: ComponentFixture<CortePrestamoDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CortePrestamoDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CortePrestamoDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
