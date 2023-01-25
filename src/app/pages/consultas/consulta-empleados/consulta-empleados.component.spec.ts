import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaEmpleadosComponent } from './consulta-empleados.component';

describe('ConsultaEmpleadosComponent', () => {
  let component: ConsultaEmpleadosComponent;
  let fixture: ComponentFixture<ConsultaEmpleadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaEmpleadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaEmpleadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
