import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public existeU = false;
  public currentUser: any;
  public userStatus: string;
  public userStatusChanges: BehaviorSubject<string>;
  public errorLogin = false;

  constructor(
    private ngZone: NgZone,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {
    this.userStatusChanges = new BehaviorSubject<string>(this.userStatus);
  }

  setUserStatus(userStatus: any): void {
    this.userStatus = userStatus;
    this.userStatusChanges.next(userStatus);
  }

  login(email: string, password: string) {
    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.errorLogin = false;
        this.firestore
          .collection('usuarios')
          .ref.where('email', '==', user.user.email)
          .onSnapshot((snap) => {
            snap.forEach((userRef) => {
              this.currentUser = userRef.data();
              localStorage.setItem(
                'User_Data',
                JSON.stringify(this.currentUser)
              );
              this.setUserStatus(this.currentUser);
              if (
                this.currentUser !== null &&
                this.currentUser.role === 'admin'
              ) {
                this.router.navigate(['/consolaV']);
              } else {
                this.router.navigate(['/']);
              }
            });
          });
      })
      .catch((err) => {
        window.alert('Usuario o contraseña inválidos');
      });
  }

  logOut() {
    this.afAuth
      .signOut()
      .then(() => {
        localStorage.removeItem('User_Data');
        this.currentUser = null;
        this.setUserStatus(null);
        this.ngZone.run(() => this.router.navigate(['/login']));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  userChanges() {
    this.afAuth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        const usr: any = JSON.parse(localStorage.getItem('User_Data'));
        if (usr !== null && usr.email === currentUser.email) {
          this.currentUser = usr;
          this.setUserStatus(this.currentUser);
          if (usr.role === 'admin') {
            this.ngZone.run(() => this.router.navigate(['/consolaV']));
          } else {
            this.ngZone.run(() => this.router.navigate(['/']));
          }
        } else {
          this.firestore
            .collection('usuarios')
            .ref.where('email', '==', currentUser.email)
            .onSnapshot((snap) => {
              snap.forEach((userRef) => {
                this.currentUser = userRef.data();
                localStorage.setItem(
                  'User_Data',
                  JSON.stringify(this.currentUser)
                );
                this.setUserStatus(this.currentUser);

                if (userRef.data() === 'admin') {
                  this.ngZone.run(() => this.router.navigate(['/consolaV']));
                } else {
                  this.ngZone.run(() => this.router.navigate(['/']));
                }
              });
            });
        }
      } else {
        this.ngZone.run(() => this.router.navigate(['/login']));
      }
    });
  }

  verficarSiExiste(email) {
    console.log(email);
    this.firestore
      .collection('usuarios')
      .ref.where('email', '==', email)
      .onSnapshot((snap) => {
        snap.forEach((userRef) => {
          this.existeU = true;
        });
      });
  }

  signUp(email, password) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }
}
