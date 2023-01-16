import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuestoAyudaComponent } from './puesto-ayuda.component';

describe('PuestoAyudaComponent', () => {
  let component: PuestoAyudaComponent;
  let fixture: ComponentFixture<PuestoAyudaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuestoAyudaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PuestoAyudaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
