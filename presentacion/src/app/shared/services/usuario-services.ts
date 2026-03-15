import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';

const _SERVER = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class UsuarioServices {
  private readonly http = inject(HttpClient);

  constructor() { }

  resetearPassw(id: string) {
    return this.http.patch(`${_SERVER}/api/usuario/reset/${id}`, {}).pipe(
      map(() => true),
      catchError((error) => {
        return of(error.status);
      })
    );
  }
}
