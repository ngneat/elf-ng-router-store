import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterService } from './router.service';

@NgModule({
  imports: [CommonModule],
})
export class ElfNgRouterStoreModule {
  constructor(private routerService: RouterService) {
    routerService.init();
  }
}
