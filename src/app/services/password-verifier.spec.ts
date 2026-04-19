import { TestBed } from '@angular/core/testing';

import { PasswordVerifier } from './password-verifier';

describe('PasswordVerifier', () => {
  let service: PasswordVerifier;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordVerifier);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
