import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { TipoVisitante } from '../models/interfaces';
import { retry, map, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

const _SERVER = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class VisitantesServices {
  private readonly http = inject(HttpClient);

  constructor() { }

  filtrar(parametros: any) {
    let params = new HttpParams;
    for (const prop in parametros) {
      params = params.append(prop, parametros[prop]);
    }
    return this.http.get<any>(`${_SERVER}/api/visitante/filtrar/0/10`, { params: params });
  }

  guardar(datos: TipoVisitante, id?: number) {
    delete datos.id_Visitante;
    const identificacion: string = datos.identificacion;
    if (id) {
      return this.http.put<any>(`${_SERVER}/api/visitante/${identificacion}`, datos);
    } else {
      return this.http.post<any>(`${_SERVER}/api/visitante`, datos);
    }
  }

  buscar(id: number) {
    return this.http.get<TipoVisitante>(`${_SERVER}/api/visitante/${id}`);
  }

  eliminar(id: string) {
    const identificacion: string = id;
    return this.http.delete<any>(`${_SERVER}/api/visitante/${identificacion}`)
      .pipe(
        retry(3),
        map(() => true),
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    return throwError(() => error.status);
  }
}
