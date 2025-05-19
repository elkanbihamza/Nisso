import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthGuard]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation when logged in', () => {
    spyOn(localStorage, 'getItem').and.returnValue('true');
    expect(guard.canActivate()).toBeTrue();
  });

  it('should block activation when not logged in', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    const routerSpy = spyOn((guard as any).router, 'navigate');
    expect(guard.canActivate()).toBeFalse();
    expect(routerSpy).toHaveBeenCalledWith(['/login']);
  });
});
