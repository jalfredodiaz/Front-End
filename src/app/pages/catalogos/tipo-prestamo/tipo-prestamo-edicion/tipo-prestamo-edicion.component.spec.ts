import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoPrestamoEdicionComponent } from './tipo-prestamo-edicion.component';

describe('TipoPrestamoEdicionComponent', () => {
  let component: TipoPrestamoEdicionComponent;
  let fixture: ComponentFixture<TipoPrestamoEdicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoPrestamoEdicionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoPrestamoEdicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
