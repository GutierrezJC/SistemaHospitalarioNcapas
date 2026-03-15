import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { TipoVisita } from '../models/interfaces';
import { retry, map, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

const _SERVER = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class VisitasServices {

  private readonly http = inject(HttpClient); // Inyección del servicio HttpClient

  constructor() { }
  filtrar(parametros: any) {
    let params = new HttpParams;
    for (const prop in parametros) {
      params = params.append(prop, parametros[prop]);
    }
    return this.http.get<any>(`${_SERVER}/api/visita/filtrar`, { params: params });
  }


  guardar(datos: any, id?: number) {
    //elimina el id del objeto datos para que no se envíe al servidor, ya que el id se maneja de forma interna en la base de datos
    return this.http.post<any>(`${_SERVER}/api/visita`, datos);

  }
  buscar(id: number) {
     return this.http.get<TipoVisita>(`${_SERVER}/api/visita/buscar/${id}`);
  }
  editar(id: number, datos: any) {

    return this.http.put<any>(`${_SERVER}/api/visita/${id}`, datos);
  }
  
  eliminar(id: number) {
    // any es para el cuerpo de la respuesta, que puede ser de cualquier tipo
    return this.http.delete<any>(`${_SERVER}/api/visita/${id}`)
      .pipe(// buscar para que es pipe
        retry(3), // reintentar 3 veces en caso de error
        map(() => true), // retornar true si la autenticación es exitosa
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    return throwError(
      () => {
        return error.status
      }
    )
  }
}
