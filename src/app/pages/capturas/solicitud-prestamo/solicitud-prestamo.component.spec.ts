import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudPrestamoComponent } from './solicitud-prestamo.component';

describe('SolicitudPrestamoComponent', () => {
  let component: SolicitudPrestamoComponent;
  let fixture: ComponentFixture<SolicitudPrestamoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitudPrestamoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudPrestamoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
