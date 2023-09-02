import { TestBed } from '@angular/core/testing';

import { NftBlocktickService } from './nft-blocktick.service';

describe('NftBlocktickService', () => {
  let service: NftBlocktickService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NftBlocktickService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
