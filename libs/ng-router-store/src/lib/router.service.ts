import { Injectable }                    from '@angular/core';
import {
  ActivatedRouteSnapshot,
  GuardsCheckEnd,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  ResolveEnd,
  Router,
  RoutesRecognized,
}                                        from '@angular/router';
import { send }                          from '@ngneat/elf-devtools';
import { RouterStateService }            from './router-state.service';
import { RouterRepository, RouterState } from './router.repository';

@Injectable({ providedIn: 'root' })
export class RouterService {
  private lastRouterState: RouterState;
  private navigationTriggeredByDispatch = false;
  private dispatchTriggeredByRouter     = false;

  constructor(
    private routerRepository: RouterRepository,
    private routerStateService: RouterStateService,
    private router: Router
  ) {}

  init() {
    this.setUpStoreListener();
    this.setUpStateUpdateEvents();
  }

  dispatchRouterCancel(event: NavigationCancel) {
    send({ type: '[Router] Navigation Cancelled' });
    this.update({ navigationId: event.id });
    this.routerStateService.navigationCancel.next(event);
  }

  dispatchRouterError(event: NavigationError) {
    send({ type: '[Router] Navigation Error' });
    this.update({ navigationId: event.id });
    this.routerStateService.navigationError.next(event);
  }

  dispatchRouterSuccess() {
    send({ type: '[Router] Navigation Succeeded' });
    this.update(this.lastRouterState);
  }

  private setUpStateUpdateEvents(): void {
    this.router.events.subscribe((e) => {
      if (
        e instanceof RoutesRecognized ||
        e instanceof GuardsCheckEnd ||
        e instanceof ResolveEnd
      ) {
        this.lastRouterState = this.serializeRoute(e);
      }
      else if (e instanceof NavigationCancel) {
        this.dispatchRouterCancel(e);
      }
      else if (e instanceof NavigationError) {
        this.dispatchRouterError(e);
      }
      else if (
        e instanceof NavigationEnd &&
        !this.navigationTriggeredByDispatch
      ) {
        this.dispatchRouterSuccess();
      }
    });
  }

  private setUpStoreListener(): void {
    this.routerRepository
      .select((state) => state)
      .subscribe((s) => {
        this.lastRouterState = s;
        this.navigateIfNeeded();
      });
  }

  private update(routerState: Partial<RouterState>) {
    this.dispatchTriggeredByRouter = true;
    this.routerRepository.update(routerState);
    this.dispatchTriggeredByRouter     = false;
    this.navigationTriggeredByDispatch = false;
  }

  private serializeRoute(
    navigationEvent: RoutesRecognized | GuardsCheckEnd | ResolveEnd
  ): RouterState {
    let state: ActivatedRouteSnapshot = navigationEvent.state.root;
    while (state.firstChild) {
      state = state.firstChild;
    }
    const { params, data, queryParams, fragment } = state;

    return {
      navigationId: navigationEvent.id,
      state: {
        url: navigationEvent.url,
        urlAfterRedirects: navigationEvent.urlAfterRedirects,
        params,
        queryParams,
        fragment,
        data,
        navigationExtras: this.router.getCurrentNavigation()?.extras
          ? this.router.getCurrentNavigation()?.extras.state
          : {},
      },
    };
  }

  private navigateIfNeeded(): void {
    if (
      !this.lastRouterState
      || !this.lastRouterState.state
      || this.dispatchTriggeredByRouter
    ) {
      return;
    }

    if (this.router.url !== this.lastRouterState.state.url) {
      this.navigationTriggeredByDispatch = true;
      this.router.navigateByUrl(this.lastRouterState.state.url);
    }

  }
}
