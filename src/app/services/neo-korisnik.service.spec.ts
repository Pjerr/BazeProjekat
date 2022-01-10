import { TestBed } from '@angular/core/testing';

import { NeoKorisnikService } from './neo-korisnik.service';

describe('NeoKorisnikService', () => {
  let service: NeoKorisnikService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NeoKorisnikService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
