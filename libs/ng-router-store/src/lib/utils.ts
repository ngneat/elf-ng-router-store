import { select } from '@ngneat/elf';
import { filter, map, Observable, OperatorFunction } from 'rxjs';

export function sliceState<K extends { state: any }>(
  section: keyof K['state'] extends never ? any : keyof K['state']
): (source: Observable<K>) => Observable<K['state'][typeof section]> {
  return (source: Observable<K>) => {
    return source.pipe(select((data) => data.state)).pipe(
      filterNilValue(),
      map((state) => state[section])
    );
  };
}

export function filterNilValue<T>(): OperatorFunction<T, NonNullable<T>> {
  return filter(
    (value: T): value is NonNullable<T> => value !== null && value !== undefined
  );
}
