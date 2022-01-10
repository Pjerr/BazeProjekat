import { TestBed } from '@angular/core/testing';

import { CasProizvodjacService } from './cas-proizvodjac.service';

describe('CasProizvodjacService', () => {
  let service: CasProizvodjacService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CasProizvodjacService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
