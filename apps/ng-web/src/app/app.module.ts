import { HttpClientModule }    from '@angular/common/http';
import { NgModule }            from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule }       from '@angular/platform-browser';
import { RouterModule }        from '@angular/router';
import { AppComponent }        from './app.component';
import { NavComponent }        from './nav/nav.component';

@NgModule({
  declarations: [AppComponent, NavComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      {
        path: 'login',
        loadChildren: () =>
          import('./auth/login/login.module').then((m) => m.LoginModule),
      },
      {
        path: 'todos',
        loadChildren: () =>
          import('./todos/todos.module').then((m) => m.TodosModule),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./users/users.module').then((m) => m.UsersModule),
      },
      {
        path: 'contacts',
        loadChildren: () =>
          import('./contacts/contacts.module').then((m) => m.ContactsModule),
      },
      {
        path: 'gallery',
        loadChildren: () =>
          import('./gallery/gallery.module').then((m) => m.GalleryModule),
      },
      {
        path: 'movies',
        loadChildren: () =>
          import('./movies/movies.module').then((m) => m.MoviesModule),
      },
    ]),
    // ElfNgRouterStoreModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
