import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap, retry, map, catchError, of } from 'rxjs';
import { Token } from './token';
import { IToken } from '../models/interfaces';
import { User } from '../models/usuario';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

const _SERVER = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(Token);
  public userActualS = signal(new User);
  private router = inject(Router);

  constructor() { }

  login(datos: { identificacion: '', passw: '' }): Observable<any> {
    return this.http.patch<any>(`${_SERVER}/api/auth`, datos)
      .pipe(
        retry(3),
        tap((tokens) => this.doLogin(tokens as IToken)),
        map(() => true),
        catchError((error) => of(error.status))
      );
  }

  private doLogin(tokens: IToken) {
    this.tokenService.setTokens(tokens);
    this.userActualS.set(this.userActual);
  }

  isLoggedIn(): boolean {
    return !!this.tokenService.getToken() && !this.tokenService.isTokenExpired();
  }

  logout() {
    if (this.isLoggedIn()) {
      this.http.delete(`${_SERVER}/api/auth/${this.userActual.id}`, {}).subscribe();
      this.doLogout();
    }
  }

  public get userActual(): User {
    if (!this.tokenService.decodeToken()) {
      return new User();
    }
    const tokenDecoded = this.tokenService.decodeToken();
    return new User({ id: tokenDecoded.sub, nombre: tokenDecoded.nom, rol: tokenDecoded.rol });
  }

  doLogout() {
    if (this.tokenService.getToken()) {
      this.tokenService.eliminarTokens();
    }
    this.userActualS.set(this.userActual);
    this.router.navigate(['/login']);
  }
}
