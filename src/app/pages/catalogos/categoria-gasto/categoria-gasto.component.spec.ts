import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaGastoComponent } from './categoria-gasto.component';

describe('CategoriaGastoComponent', () => {
  let component: CategoriaGastoComponent;
  let fixture: ComponentFixture<CategoriaGastoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoriaGastoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriaGastoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
