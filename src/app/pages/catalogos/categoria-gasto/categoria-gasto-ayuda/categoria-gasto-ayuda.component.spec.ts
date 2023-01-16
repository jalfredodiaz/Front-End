import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaGastoAyudaComponent } from './categoria-gasto-ayuda.component';

describe('CategoriaGastoAyudaComponent', () => {
  let component: CategoriaGastoAyudaComponent;
  let fixture: ComponentFixture<CategoriaGastoAyudaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoriaGastoAyudaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriaGastoAyudaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
