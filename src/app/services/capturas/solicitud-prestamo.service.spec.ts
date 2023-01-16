import { TestBed } from '@angular/core/testing';

import { SolicitudPrestamoService } from './solicitud-prestamo.service';

describe('SolicitudPrestamoService', () => {
  let service: SolicitudPrestamoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitudPrestamoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
