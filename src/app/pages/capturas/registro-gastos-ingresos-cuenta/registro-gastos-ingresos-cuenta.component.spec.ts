import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroGastosIngresosCuentaComponent } from './registro-gastos-ingresos-cuenta.component';

describe('RegistroGastosIngresosCuentaComponent', () => {
  let component: RegistroGastosIngresosCuentaComponent;
  let fixture: ComponentFixture<RegistroGastosIngresosCuentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroGastosIngresosCuentaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroGastosIngresosCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
