import { Injectable } from '@angular/core';
import { NavigationCancel, NavigationError } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RouterStateService {
  navigationCancel = new Subject<NavigationCancel>();
  navigationError = new Subject<NavigationError>();
}
