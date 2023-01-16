import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoPrestamoAyudaComponent } from './tipo-prestamo-ayuda.component';

describe('TipoPrestamoAyudaComponent', () => {
  let component: TipoPrestamoAyudaComponent;
  let fixture: ComponentFixture<TipoPrestamoAyudaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoPrestamoAyudaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoPrestamoAyudaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
