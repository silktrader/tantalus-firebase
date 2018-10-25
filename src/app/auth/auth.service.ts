import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of, Subject, BehaviorSubject } from "rxjs";

import { Router } from '@angular/router';

interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  favoriteColor?: string;
}

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
    //console.log("User check: is " + (this.user == null ? "null" : this.user.uid));
    return true;
  }

  get userID(): string {
    return this.afAuth.auth.currentUser.uid;
  }
}
