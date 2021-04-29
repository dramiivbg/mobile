import { TestBed } from '@angular/core/testing';

import { SyncerpService } from './syncerp.service';

describe('SyncerpService', () => {
  let service: SyncerpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SyncerpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
