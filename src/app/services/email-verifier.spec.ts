import { TestBed } from '@angular/core/testing';

import { EmailVerifier } from './email-verifier';

describe('EmailVerifier', () => {
  let service: EmailVerifier;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailVerifier);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
