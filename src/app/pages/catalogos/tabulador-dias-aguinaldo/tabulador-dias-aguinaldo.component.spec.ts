import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabuladorDiasAguinaldoComponent } from './tabulador-dias-aguinaldo.component';

describe('TabuladorDiasAguinaldoComponent', () => {
  let component: TabuladorDiasAguinaldoComponent;
  let fixture: ComponentFixture<TabuladorDiasAguinaldoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabuladorDiasAguinaldoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabuladorDiasAguinaldoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
