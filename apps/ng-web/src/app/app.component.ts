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
    .selectParams()
    .subscribe((params) => console.log(params));
    routerRepository
    .selectQueryParams()
    .subscribe((queryParams) => console.log(queryParams));
  }
}
