import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaEscalonadoComponent } from './consulta-escalonado.component';

describe('ConsultaEscalonadoComponent', () => {
  let component: ConsultaEscalonadoComponent;
  let fixture: ComponentFixture<ConsultaEscalonadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaEscalonadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaEscalonadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
