import { Component, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatMenu } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../shared/services/auth-service';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FrmLogin } from '../forms/frm-login/frm-login';


@Component({
  selector: 'app-header',
  imports: [MatIconModule, MatIconButton, MatMenuModule, MatMenuTrigger, RouterModule, MatMenu, MatIcon],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  protected readonly srvAuth = inject(AuthService);
  private readonly dialog = inject(MatDialog);

  logOut() {
    this.srvAuth.logout();
  }

  logIn() {
    this.dialog.open(FrmLogin, {
      width: '400px',
      height: '300px',
      disableClose: true
    });
  }
}
