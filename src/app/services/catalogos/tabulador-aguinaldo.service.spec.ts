import { TestBed } from '@angular/core/testing';

import { TabuladorAguinaldoService } from './tabulador-aguinaldo.service';

describe('TabuladorAguinaldoService', () => {
  let service: TabuladorAguinaldoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TabuladorAguinaldoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
