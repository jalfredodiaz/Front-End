import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabuladorTiempoAntiguedadComponent } from './tabulador-tiempo-antiguedad.component';

describe('TabuladorTiempoAntiguedadComponent', () => {
  let component: TabuladorTiempoAntiguedadComponent;
  let fixture: ComponentFixture<TabuladorTiempoAntiguedadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabuladorTiempoAntiguedadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabuladorTiempoAntiguedadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
