import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroGastosIngresosCuentaAyudaComponent } from './registro-gastos-ingresos-cuenta-ayuda.component';

describe('RegistroGastosIngresosCuentaAyudaComponent', () => {
  let component: RegistroGastosIngresosCuentaAyudaComponent;
  let fixture: ComponentFixture<RegistroGastosIngresosCuentaAyudaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroGastosIngresosCuentaAyudaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroGastosIngresosCuentaAyudaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
