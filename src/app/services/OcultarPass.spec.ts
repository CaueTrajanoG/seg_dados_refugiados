import { TestBed } from '@angular/core/testing';

import { OculterPass } from './OcultarPass';

describe('Database', () => {
  let oculter: OculterPass;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    oculter = TestBed.inject(OculterPass);
  });

  it('should be created', () => {
    expect(oculter).toBeTruthy();
  });

  it('Deve gerar um hash a partir da senha original', async () => {
    const originalPass = 'NewPass@2026'
    const hashPass = await oculter.passwordOculter(originalPass);
    expect(oculter).not.toBe(originalPass);
    expect(hashPass).length.greaterThan(15);
  });
});
