import { Injectable }                                             from '@angular/core';
import { createState, filterNil, select, Store, withProps }       from '@ngneat/elf';
import { combineLatest, distinctUntilChanged, Observable, pluck } from 'rxjs';
import { RouterStateService }                                     from './router-state.service';
import { HashMap }                                                from './util.types';
import { sliceState }                                             from './utils';

export type ActiveRouteState = {
  url: string;
  urlAfterRedirects: string;
  fragment: string | null;
  params: HashMap<any>;
  queryParams: HashMap<any>;
  data: HashMap<any>;
  navigationExtras: HashMap<any> | undefined;
};

export type RouterState = {
  state: ActiveRouteState | null;
  navigationId: number | null;
};

const { state, config } = createState(
  withProps<RouterState>({
    state: null,
    navigationId: null,
  })
);

const store = new Store({ state, name: 'router', config });

@Injectable({ providedIn: 'root' })
export class RouterRepository {
  constructor(private routerStateService: RouterStateService) {}

  select(): Observable<RouterState>;
  select<R>(cb: (state: RouterState) => R): Observable<R>;
  select<R>(
    cb?: (state: RouterState) => R
  ): Observable<typeof cb extends never ? RouterState : R> {
    const callback = cb ? cb : (state: any) => state;
    return store.pipe(select(callback));
  }

  getValue() {
    return store.getValue();
  }

  /**
   * Params
   * @param names
   */
  selectParams<T extends string>(names: string[]): Observable<T[]>;
  selectParams<T extends string>(names?: string): Observable<T>;
  selectParams<T extends string>(
    names?: string | string[]
  ): Observable<T | T[] | null> {
    // todo is this useful?
    if (names === undefined) {
      return store.pipe(sliceState('params'));
    }

    const _select = (p: string) =>
      store.pipe(
        sliceState<RouterState>('params'),
        pluck(p),
        filterNil()
      );

    if (Array.isArray(names)) {
      const sources = names.map(_select);
      return combineLatest(sources);
    }

    return _select(names).pipe(distinctUntilChanged());
  }

  getParams<T = any>(name?: string): T | null {
    if (store.getValue().state) {
      const params = store.getValue().state?.params;
      if (name === undefined) {
        return params as T;
      }

      return params && params[name];
    }

    return null;
  }

  /**
   * Query params
   * @param names
   */
  selectQueryParams<T extends string>(names: string[]): Observable<T[]>;
  selectQueryParams<T extends string>(names?: string): Observable<T>;
  selectQueryParams<T extends string>(
    names?: string | string[]
  ): Observable<T | T[] | null> {
    if (names === undefined) {
      return store.pipe(sliceState('queryParams'));
    }

    const _select = (p: string) =>
      store.pipe(
        sliceState<RouterState>('queryParams'),
        pluck(p),
        filterNil()
      );

    if (Array.isArray(names)) {
      const sources = names.map(_select);
      return combineLatest(sources);
    }

    return _select(names);
  }

  getQueryParams<T = any>(name?: string): T | null {
    if (store.getValue().state) {
      const queryParams = store.getValue().state?.queryParams;
      if (name === undefined) {
        return queryParams as T;
      }

      return queryParams && queryParams[name];
    }

    return null;
  }

  /**
   * Fragment
   */
  selectFragment(): Observable<string> {
    return store.pipe(sliceState('fragment'), filterNil());
  }

  getFragment(): string | undefined | null {
    if (store.getValue().state) {
      return store.getValue().state?.fragment;
    }

    return null;
  }

  /**
   * Data
   * @param name
   */
  selectData<T = any>(name?: string): Observable<T> {
    if (name === undefined) {
      return store.pipe(sliceState('data'), filterNil());
    }

    return store.pipe(sliceState('data'), pluck(name), filterNil());
  }

  getData<T = any>(name?: string): T | null {
    if (store.getValue().state) {
      const data = store.getValue().state?.data;
      if (name === undefined) {
        return data as T;
      }

      return data && data[name];
    }

    return null;
  }

  /**
   * Navigation extras
   * @param name
   */
  selectNavigationExtras<T = any>(name?: string): Observable<T> {
    if (name === undefined) {
      return store.pipe(sliceState('navigationExtras'), filterNil());
    }

    return store.pipe(sliceState('data'), pluck(name), filterNil());
  }

  getNavigationExtras<T = any>(name?: string): T | null {
    if (store.getValue().state) {
      const data = store.getValue().state?.navigationExtras;
      if (name === undefined) {
        return data as T;
      }

      return data && data[name];
    }

    return null;
  }

  /**
   * Error
   */
  selectNavigationError() {
    return this.routerStateService.navigationError.asObservable();
  }

  /**
   * Cancel
   */
  selectNavigationCancel() {
    return this.routerStateService.navigationCancel.asObservable();
  }

  /**
   * Update
   * @param update
   */
  update(update: Partial<RouterState>) {
    store.update((state) => ({ ...state, ...update }));
  }
}


console.log("test")
