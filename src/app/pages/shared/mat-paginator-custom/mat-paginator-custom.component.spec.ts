import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatPaginatorCustomComponent } from './mat-paginator-custom.component';

describe('MatPaginatorCustomComponent', () => {
  let component: MatPaginatorCustomComponent;
  let fixture: ComponentFixture<MatPaginatorCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatPaginatorCustomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatPaginatorCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
