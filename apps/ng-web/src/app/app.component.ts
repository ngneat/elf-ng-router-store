import { Component }        from '@angular/core';
import { RouterRepository } from '@ngneat/elf-ng-router-store';

@Component({
  selector: 'elf-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ng';

  constructor(private routerRepository: RouterRepository) {
    routerRepository
      .selectParams('id')
      .subscribe((param) => console.log(param));
    routerRepository
      .selectQueryParams('test')
      .subscribe((queryParam) => console.log(queryParam));
  }
}
