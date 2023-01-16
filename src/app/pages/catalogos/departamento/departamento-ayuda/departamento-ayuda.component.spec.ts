import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartamentoAyudaComponent } from './departamento-ayuda.component';

describe('DepartamentoAyudaComponent', () => {
  let component: DepartamentoAyudaComponent;
  let fixture: ComponentFixture<DepartamentoAyudaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartamentoAyudaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartamentoAyudaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
