import { TestBed } from '@angular/core/testing';

import { CortePrestamoService } from './corte-prestamo.service';

describe('CortePrestamoService', () => {
  let service: CortePrestamoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CortePrestamoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
