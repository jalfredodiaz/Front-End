import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CortePrestamoAyudaComponent } from './corte-prestamo-ayuda.component';

describe('CortePrestamoAyudaComponent', () => {
  let component: CortePrestamoAyudaComponent;
  let fixture: ComponentFixture<CortePrestamoAyudaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CortePrestamoAyudaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CortePrestamoAyudaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
