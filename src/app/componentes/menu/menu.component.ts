import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  user: any;
  username: string = 'Usuario';

  constructor(private authSrv: AuthService) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('User_Data'));
    this.username = this.user.nombre;
  }

  logout() {
    this.authSrv.logOut();
  }
}
