import { TestBed } from '@angular/core/testing';

import { TabuladorVacacionesService } from './tabulador-vacaciones.service';

describe('TabuladorVacacionesService', () => {
  let service: TabuladorVacacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TabuladorVacacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
