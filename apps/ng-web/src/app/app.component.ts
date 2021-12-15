import { Component } from '@angular/core';

@Component({
  selector: 'elf-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ng';

  // constructor(private routerRepository: RouterRepository) {
  //   routerRepository
  //     .selectParams('id')
  //     .subscribe((param) => console.log(param));
  //   routerRepository
  //     .selectQueryParams('test')
  //     .subscribe((queryParam) => console.log(queryParam));
  // }
}
