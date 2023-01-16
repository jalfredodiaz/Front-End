import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GastosCuentaMantenimientoComponent } from './gastos-cuenta-mantenimiento.component';

describe('GastosCuentaMantenimientoComponent', () => {
  let component: GastosCuentaMantenimientoComponent;
  let fixture: ComponentFixture<GastosCuentaMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GastosCuentaMantenimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GastosCuentaMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
