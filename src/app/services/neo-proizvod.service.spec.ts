import { TestBed } from '@angular/core/testing';

import { NeoProizvodService } from './neo-proizvod.service';

describe('NeoProizvodService', () => {
  let service: NeoProizvodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NeoProizvodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
