import { APP_BASE_HREF }                                                          from '@angular/common';
import { Component, Injectable }                                          from '@angular/core';
import { fakeAsync, TestBed, tick }                                               from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivate, NavigationExtras, Router, Routes, } from '@angular/router';
import { RouterTestingModule }                                                    from '@angular/router/testing';
import { ElfNgRouterStoreModule }                                                 from './ng-router-store.module';
import { RouterRepository }                                                       from './router.repository';

@Component({
  selector: 'elf-test-empty',
  template: '',
})
class EmptyComponent {}

const intentionalTestError = new Error('Intentional test error.');

@Injectable()
class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot) {
    if (route.url.toString().includes('throw-error')) {
      throw intentionalTestError;
    }

    if (route.url.toString().includes('redirect-home')) {
      return this.router.parseUrl('/home');
    }

    return !route.url.toString().includes('fail-auth-guard');
  }
}

const routes: Routes = [
  {
    path: 'simple',
    component: EmptyComponent,
  },
  {
    path: 'test/:someParam/:other',
    component: EmptyComponent,
  },
  {
    path: 'with-data',
    data: { actor: 'Brent Spiner' },
    component: EmptyComponent,
  },
  {
    path: '**',
    canActivate: [AuthGuard],
    component: EmptyComponent,
  },
];

describe('RouterService', () => {
  let routerRepository: RouterRepository;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), ElfNgRouterStoreModule],
      declarations: [EmptyComponent],
      providers: [AuthGuard, { provide: APP_BASE_HREF, useValue: '/' }],
    }).compileComponents();

    routerRepository = TestBed.get(RouterRepository);
    router           = TestBed.get(Router);

    navigateByUrl('start');
  });

  afterEach(() => {
    routerRepository.update({ state: null, navigationId: null });
  });

  function navigateByUrl(url: string, navigationExtras?: NavigationExtras) {
    return router.navigateByUrl(url, navigationExtras)
  }

  it('should update the router state after a successful navigation', async () => {
    await navigateByUrl('/simple');

    expect(routerRepository.getValue().navigationId).toEqual(2);
    expect(routerRepository.getValue().state?.url).toEqual('/simple');
  });

  it('should update the router state when only the hash changes', async () => {
    await navigateByUrl('/start#hashBrowns');

    expect(routerRepository.getValue().navigationId).toEqual(2);
    expect(routerRepository.getFragment()).toEqual('hashBrowns');
  });

  it('should update the router state when only query parameters change', async () => {
    await navigateByUrl('/start?one=1&two=2');

    expect(routerRepository.getValue().navigationId).toEqual(2);
    expect(routerRepository.getQueryParams()).toEqual({ one: '1', two: '2' });
  });

  it('should emit a navigationCancel event when canActivate returns false', async () => {
    expect.assertions(3);
    routerRepository.selectNavigationCancel().subscribe((event) => {
      expect(event).toEqual({ id: 2, reason: '', url: '/fail-auth-guard' });
    });

    await navigateByUrl('fail-auth-guard');

    expect(routerRepository.getValue().navigationId).toEqual(2);
    expect(routerRepository.getValue().state?.url).toEqual('/start');
  });

  it('should emit a navigationError event when canActivate throws an error', async () => {
    expect.assertions(3);
    routerRepository.selectNavigationError().subscribe((event) => {
      expect(event).toEqual({
        id: 2,
        error: intentionalTestError,
        url: '/throw-error',
      });
    });

    try {
      await navigateByUrl('throw-error');
    } catch (err) {
      console.error(err);
    }

    expect(routerRepository.getValue().navigationId).toEqual(2);
    expect(routerRepository.getValue().state?.url).toEqual('/start');
  });

  it('should not update the state with urls that are never activated due to canActivate redirects', fakeAsync(() => {
    expect.assertions(3);

    routerRepository.selectNavigationCancel().subscribe((event) => {
      expect(event).toEqual({
        id: 2,
        reason: 'NavigationCancelingError: Redirecting to "/home"',
        url: '/redirect-home',
      });
    });

    routerRepository.select().subscribe(({ navigationId, state }) => {
      if (navigationId === 2) {
        expect(state).toEqual({
          data: {},
          fragment: null,
          navigationExtras: undefined,
          params: {},
          queryParams: {},
          url: '/start',
          urlAfterRedirects: '/start',
        });
      }
      else if (navigationId === 3) {
        expect(state).toEqual({
          data: {},
          fragment: null,
          navigationExtras: undefined,
          params: {},
          queryParams: {},
          url: '/home',
          urlAfterRedirects: '/home',
        });
      }
    });

    navigateByUrl('/redirect-home');
    tick();
  }));

  it('should support getting route params by name', async () => {
    await navigateByUrl('/test/100/200');

    expect(routerRepository.getParams('someParam')).toEqual('100');
    expect(routerRepository.getParams('other')).toEqual('200');
  });

  it('should support getting state provided in navigationExtras', async () => {
    await navigateByUrl('/simple', { state: { custom: 'yay' } });

    expect(routerRepository.getNavigationExtras('custom')).toEqual('yay');
  });

  it('should support getting route data', async () => {
    await navigateByUrl('with-data');

    expect(routerRepository.getData()).toEqual({ actor: 'Brent Spiner' });
  });
});
