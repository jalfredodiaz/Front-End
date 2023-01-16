import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaSolicitudPrestamosComponent } from './consulta-solicitud-prestamos.component';

describe('ConsultaSolicitudPrestamosComponent', () => {
  let component: ConsultaSolicitudPrestamosComponent;
  let fixture: ComponentFixture<ConsultaSolicitudPrestamosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaSolicitudPrestamosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaSolicitudPrestamosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
