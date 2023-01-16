import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartamentoEdicionComponent } from './departamento-edicion.component';

describe('DepartamentoEdicionComponent', () => {
  let component: DepartamentoEdicionComponent;
  let fixture: ComponentFixture<DepartamentoEdicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartamentoEdicionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartamentoEdicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
