import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaGastoEdicionComponent } from './categoria-gasto-edicion.component';

describe('CategoriaGastoEdicionComponent', () => {
  let component: CategoriaGastoEdicionComponent;
  let fixture: ComponentFixture<CategoriaGastoEdicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoriaGastoEdicionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriaGastoEdicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
