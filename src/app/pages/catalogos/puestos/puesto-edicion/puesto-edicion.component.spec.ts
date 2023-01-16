import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuestoEdicionComponent } from './puesto-edicion.component';

describe('PuestoEdicionComponent', () => {
  let component: PuestoEdicionComponent;
  let fixture: ComponentFixture<PuestoEdicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuestoEdicionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PuestoEdicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
