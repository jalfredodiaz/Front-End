import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GastosCuentaPublicaComponent } from './gastos-cuenta-publica.component';

describe('GastosCuentaPublicaComponent', () => {
  let component: GastosCuentaPublicaComponent;
  let fixture: ComponentFixture<GastosCuentaPublicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GastosCuentaPublicaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GastosCuentaPublicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
