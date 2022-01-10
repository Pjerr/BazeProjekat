import { TestBed } from '@angular/core/testing';

import { CasPopularnoService } from './cas-popularno.service';

describe('CasPopularnoService', () => {
  let service: CasPopularnoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CasPopularnoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
