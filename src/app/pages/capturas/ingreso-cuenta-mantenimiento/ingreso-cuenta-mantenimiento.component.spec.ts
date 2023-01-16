import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresoCuentaMantenimientoComponent } from './ingreso-cuenta-mantenimiento.component';

describe('IngresoCuentaMantenimientoComponent', () => {
  let component: IngresoCuentaMantenimientoComponent;
  let fixture: ComponentFixture<IngresoCuentaMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngresoCuentaMantenimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IngresoCuentaMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
