import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentasAyudaComponent } from './cuentas-ayuda.component';

describe('CuentasAyudaComponent', () => {
  let component: CuentasAyudaComponent;
  let fixture: ComponentFixture<CuentasAyudaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuentasAyudaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentasAyudaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
