import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleadoEdicionComponent } from './empleado-edicion.component';

describe('EmpleadoEdicionComponent', () => {
  let component: EmpleadoEdicionComponent;
  let fixture: ComponentFixture<EmpleadoEdicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpleadoEdicionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpleadoEdicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
