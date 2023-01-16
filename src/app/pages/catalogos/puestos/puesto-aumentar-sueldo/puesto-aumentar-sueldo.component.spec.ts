import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuestoAumentarSueldoComponent } from './puesto-aumentar-sueldo.component';

describe('PuestoAumentarSueldoComponent', () => {
  let component: PuestoAumentarSueldoComponent;
  let fixture: ComponentFixture<PuestoAumentarSueldoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuestoAumentarSueldoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PuestoAumentarSueldoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
