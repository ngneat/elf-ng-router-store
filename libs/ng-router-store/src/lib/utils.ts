import { filterNil, select } from '@ngneat/elf';
import { map, Observable }   from 'rxjs';

export function sliceState<K extends { state: any }>(
  section: keyof K['state'] extends never ? any : keyof K['state']
): (source: Observable<K>) => Observable<K['state'][typeof section]> {
  return (source: Observable<K>) => {
    return source.pipe(select((data) => data.state)).pipe(
      filterNil(),
      map((state) => state[section])
    );
  };
}
