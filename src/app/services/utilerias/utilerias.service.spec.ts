import { TestBed } from '@angular/core/testing';

import { UtileriasService } from './utilerias.service';

describe('UtileriasService', () => {
  let service: UtileriasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtileriasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
