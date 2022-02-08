import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user: any;
  username: string = 'Usuario';

  constructor(private authSrv: AuthService) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('User_Data'));
    this.username = this.user.nombre;
  }

  logout() {
    this.authSrv.logOut();
  }
}
