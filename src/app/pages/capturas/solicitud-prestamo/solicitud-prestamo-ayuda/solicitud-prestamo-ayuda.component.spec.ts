import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudPrestamoAyudaComponent } from './solicitud-prestamo-ayuda.component';

describe('SolicitudPrestamoAyudaComponent', () => {
  let component: SolicitudPrestamoAyudaComponent;
  let fixture: ComponentFixture<SolicitudPrestamoAyudaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitudPrestamoAyudaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudPrestamoAyudaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
