import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoPrestamoComponent } from './tipo-prestamo.component';

describe('TipoPrestamoComponent', () => {
  let component: TipoPrestamoComponent;
  let fixture: ComponentFixture<TipoPrestamoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoPrestamoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoPrestamoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
