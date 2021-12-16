
Angular Router Store
---

> Bindings to connect Angular router to Elf store.

To get started, install the `@ngneat/elf-ng-router-store` package and add to the `AppModule` the Elf’s devtools modules:

```ts title="app.module.ts"
import { ElfNgRouterStoreModule } from '@elf/ng-router-store';

@NgModule({
imports: [
  ElfNgRouterStoreModule
})
export class AppModule {
}
```

With this setup, you'll get two things:
1. You'll see the Router actions in Redux devtools.
2. A unique set of selectors to query the router state:

## selectParams
```ts
import { RouterRepository } from '@elf/ng-router-store';

export class UsersRepository {
   constructor(private routerRepository: RouterRepository) {
     routerRepository.selectParams().subscribe();
     routerRepository.selectParams('id').subscribe();
     routerRepository.selectParams(['id', 'type']).subscribe();
   }
}
```

## getParams
```ts
import { RouterRepository } from '@elf/ng-router-store';

export class UsersRepository {
   constructor(private routerRepository: RouterRepository) {
     const params = routerRepository.getParams()
   }
}
```

## selectQueryParams
```ts
import { RouterRepository } from '@elf/ng-router-store';

export class UsersRepository {
   constructor(private routerRepository: RouterRepository) {
     routerRepository.selectQueryParams().subscribe();
     routerRepository.selectQueryParams('redirectTarget').subscribe();
     routerRepository.selectQueryParams(['redirectTarget', 'type']).subscribe();
   }
}
```

## getQueryParams
```ts
import { RouterRepository } from '@elf/ng-router-store';

export class UsersRepository {
   constructor(private routerRepository: RouterRepository) {
     const redirectTarget = routerRepository.getQueryParams().redirectTarget
   }
}
```

## selectFragment

```ts
import { RouterRepository } from '@elf/ng-router-store';

export class UsersRepository {
   constructor(private routerRepository: RouterRepository) {
     routerRepository.selectFragment().subscribe();
   }
}
```

## getFragment
```ts
import { RouterRepository } from '@elf/ng-router-store';

export class UsersRepository {
   constructor(private routerRepository: RouterRepository) {
     const fragment = routerRepository.getFragment()
   }
}
```

## selectData

```ts
import { RouterRepository } from '@elf/ng-router-store';

export class UsersRepository {
   constructor(private routerRepository: RouterRepository) {
     routerRepository.selectData().subscribe();
     routerRepository.selectData('id').subscribe();
     routerRepository.selectData(['id', 'type']).subscribe();
   }
}
```

## getData
```ts
import { RouterRepository } from '@elf/ng-router-store';

export class UsersRepository {
   constructor(private routerRepository: RouterRepository) {
     const data = routerRepository.getData()
   }
}
```

## selectNavigationExtras

```ts
import { RouterRepository } from '@elf/ng-router-store';

export class UsersRepository {
   constructor(private routerRepository: RouterRepository) {
     routerRepository.selectNavigationExtras().subscribe();
     routerRepository.selectNavigationExtras('id').subscribe();
     routerRepository.selectNavigationExtras(['id', 'type']).subscribe();
   }
}
```

## getNavigationExtras
```ts
import { RouterRepository } from '@elf/ng-router-store';

export class UsersRepository {
   constructor(private routerRepository: RouterRepository) {
     const extras = routerRepository.getNavigationExtras()
   }
}
```

## selectNavigationCancel

```ts
import { RouterRepository } from '@elf/ng-router-store';

export class UsersRepository {
   constructor(private routerRepository: RouterRepository) {
     routerRepository.selectNavigationCancel().subscribe();
   }
}
```


## selectNavigationError

```ts
import { RouterRepository } from '@elf/ng-router-store';

export class UsersRepository {
   constructor(private routerRepository: RouterRepository) {
     routerRepository.selectNavigationError().subscribe();
   }
}
```

## Use case
For example, we can create a query that maps an id from the URL to an entity in the store:

```ts title="articles.query.ts"
export class ArticlesRepository {
  selectArticle$ = this.routerRepository.selectParams('id').pipe(
     switchMap(id => this.selectEntity(id))
  );

  constructor(private routerRepository: RouterRepository) {}
}
```

And use it in the component:
```ts title="articles.component.ts"
@Component()
export class ArticleComponent {
  article$ = this.articlesRepository.selectArticle$;

  constructor(private articlesRepository: ArticlesRepository) {}
}
```

## Lazy Load Modules
To get the lazy modules routing params, add the following option to the `RouterModule.forRoot` method:

```ts title="main.ts"
{
  imports: [
    RouterModule.forRoot(routes, {
      paramsInheritanceStrategy: 'always'
    })
  ]
}
```
