import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaMovimientosCuentaComponent } from './consulta-movimientos-cuenta.component';

describe('ConsultaMovimientosCuentaComponent', () => {
  let component: ConsultaMovimientosCuentaComponent;
  let fixture: ComponentFixture<ConsultaMovimientosCuentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaMovimientosCuentaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaMovimientosCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
