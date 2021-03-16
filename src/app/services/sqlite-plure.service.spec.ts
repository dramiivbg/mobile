import { TestBed } from '@angular/core/testing';

import { SqlitePlureService } from './sqlite-plure.service';

describe('SqlitePlureService', () => {
  let service: SqlitePlureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SqlitePlureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
