import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleadoAyudaComponent } from './empleado-ayuda.component';

describe('EmpleadoAyudaComponent', () => {
  let component: EmpleadoAyudaComponent;
  let fixture: ComponentFixture<EmpleadoAyudaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpleadoAyudaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpleadoAyudaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
