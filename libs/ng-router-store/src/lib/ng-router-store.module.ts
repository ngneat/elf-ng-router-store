import { NgModule }      from '@angular/core';
import { RouterService } from './router.service';

@NgModule()
export class ElfNgRouterStoreModule {
  constructor(private routerService: RouterService) {
    routerService.init();
  }
}
