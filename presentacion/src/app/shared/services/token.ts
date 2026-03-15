import { Injectable } from '@angular/core';
import { IToken } from '../models/interfaces';
import {JwtHelperService} from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class Token {
  private readonly JWT_TOKEN: string = 'JWT_TOKEN'; // EL TOKEN DE AUTENTICACION
  private readonly REFRESH_TOKEN: string = 'REFRESH_TOKEN';// EL TOKEN DE REFRESCO

  constructor() { }
// METODOS DEL LOCAL STORAGE osea del navegador
// GUARDAR datos
//localStorage.setItem('clave', 'valor');
// OBTENER datos  
//const valor = localStorage.getItem('clave'); // Devuelve string | null

  setToken(token: string): void {
    localStorage.setItem(this.JWT_TOKEN, token);
  } 
  
  setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN, token);
  }
  
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }
  getToken(): string | null {
    return localStorage.getItem(this.JWT_TOKEN);
  } 

  setTokens(token : IToken): void {
    this.setToken(token.token);// DE TODO EL TOKEN SOLO SETEE EL TOKEN AQUI SACO EXACTAMENT El TOKEN
    this.setRefreshToken(token.tkRef);// DE TODO EL TOKEN SOLO SETEE EL REFRESH TOKEN
  }

  getTokens(): IToken {
    return {
      token: this.getToken() || '',
      tkRef: this.getRefreshToken() || ''
    };
  }

  public eliminarTokens(): void {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  } 
   
  decodeToken(): any { // decodifica el token y devuelve el contenido
    const helper = new JwtHelperService();
    const token = this.getToken();
    return helper.decodeToken(token || ''); 
  }

  isTokenExpired(): String | any {
    const helper = new JwtHelperService();// FUNCION DE DECODIFICACION DE JWT
    const token = this.getToken();
    return helper.isTokenExpired(token || ''); // Retorna null si el token ha expirado, de lo contrario retorna el objeto Token
  }



}
