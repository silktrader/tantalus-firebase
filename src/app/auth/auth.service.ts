import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(public afAuth: AngularFireAuth, private router: Router) { }

  login(email: string, password: string) {
    this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .catch(error => {
        console.log(error.message);
      });
  }

  signout() {
    this.afAuth.auth.signOut();
  }

  get isLoggedIn(): boolean {
    return true;
  }

  get userID(): string | null {
    if (this.afAuth.auth.currentUser == null)
      return null; // tk warn?
    return this.afAuth.auth.currentUser.uid;
  }
}
