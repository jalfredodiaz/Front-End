import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaCorteDePrestamosComponent } from './consulta-corte-de-prestamos.component';

describe('ConsultaCorteDePrestamosComponent', () => {
  let component: ConsultaCorteDePrestamosComponent;
  let fixture: ComponentFixture<ConsultaCorteDePrestamosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaCorteDePrestamosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaCorteDePrestamosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
