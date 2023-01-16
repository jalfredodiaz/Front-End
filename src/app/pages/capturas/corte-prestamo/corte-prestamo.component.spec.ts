import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CortePrestamoComponent } from './corte-prestamo.component';

describe('CortePrestamoComponent', () => {
  let component: CortePrestamoComponent;
  let fixture: ComponentFixture<CortePrestamoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CortePrestamoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CortePrestamoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
