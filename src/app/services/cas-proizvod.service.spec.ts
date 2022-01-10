import { TestBed } from '@angular/core/testing';

import { CasProizvodService } from './cas-proizvod.service';

describe('CasProizvodService', () => {
  let service: CasProizvodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CasProizvodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
