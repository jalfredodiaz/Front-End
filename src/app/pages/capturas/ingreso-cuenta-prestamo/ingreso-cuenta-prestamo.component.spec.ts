import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresoCuentaPrestamoComponent } from './ingreso-cuenta-prestamo.component';

describe('IngresoCuentaPrestamoComponent', () => {
  let component: IngresoCuentaPrestamoComponent;
  let fixture: ComponentFixture<IngresoCuentaPrestamoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngresoCuentaPrestamoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IngresoCuentaPrestamoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
