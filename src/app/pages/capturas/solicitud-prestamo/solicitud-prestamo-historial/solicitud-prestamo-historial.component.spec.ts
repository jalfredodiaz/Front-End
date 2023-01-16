import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudPrestamoHistorialComponent } from './solicitud-prestamo-historial.component';

describe('SolicitudPrestamoHistorialComponent', () => {
  let component: SolicitudPrestamoHistorialComponent;
  let fixture: ComponentFixture<SolicitudPrestamoHistorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitudPrestamoHistorialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudPrestamoHistorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
