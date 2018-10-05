import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

    // return this.authService.afAuth.user.pipe(
    //   take(1),
    //   map(user => !!user),
    //   tap(loggedIn => {
    //     if (!loggedIn) {
    //       console.log('access denied')
    //       this.router.navigate(['/login']);
    //     }
    //   }))

    return this.authService.afAuth.authState.pipe(take(1), map((user) => {
      if (user == null) {
        this.router.navigate(['/login']);
        return false;
      }

      return true;
    }));
  }
}
