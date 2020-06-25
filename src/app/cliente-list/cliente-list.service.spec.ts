import { TestBed } from '@angular/core/testing';

import { ClienteListService } from './cliente-list.service';

describe('ClienteListService', () => {
  let service: ClienteListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClienteListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
