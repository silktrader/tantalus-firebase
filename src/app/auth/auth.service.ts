import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, Subject, BehaviorSubject } from "rxjs";

import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn: boolean = false;

  constructor(private afAuth: AngularFireAuth, private router: Router) { }

  init() {
    console.log("init");
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.isLoggedIn = true;
        this.router.navigate(["/calendar"]);
        console.log("Logged in");
      } else {
        this.isLoggedIn = false;
        this.router.navigate(["/login"]);
        console.log("Logged out");
      }
    });
  }

  login(email: string, password: string) {
    this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .catch(error => {
        console.log(error.message);
      });
  }

  logout() {
    this.afAuth.auth.signOut();
  }
}
