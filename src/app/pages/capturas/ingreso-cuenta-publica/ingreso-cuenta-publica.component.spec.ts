import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresoCuentaPublicaComponent } from './ingreso-cuenta-publica.component';

describe('IngresoCuentaPublicaComponent', () => {
  let component: IngresoCuentaPublicaComponent;
  let fixture: ComponentFixture<IngresoCuentaPublicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngresoCuentaPublicaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IngresoCuentaPublicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
