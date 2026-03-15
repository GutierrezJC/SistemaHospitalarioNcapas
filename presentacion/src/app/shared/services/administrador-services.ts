import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TipoAdministrador } from '../models/interfaces';
import { environment } from '../../../environments/environment';

const _SERVER = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class AdministradorServices {
  private readonly http = inject(HttpClient);

  constructor() { }

  filtrar(parametros: any) {
    let params = new HttpParams;
    for (const prop in parametros) {
      params = params.append(prop, parametros[prop]);
    }
    return this.http.get<any>(`${_SERVER}/api/administrador/filtrar/0/10`, { params: params });
  }

  guardar(administrador: any) {
    return this.http.post<any>(`${_SERVER}/api/administrador`, administrador);
  }

  eliminar(id: string) {
    return this.http.delete<any>(`${_SERVER}/api/administrador/${id}`);
  }

  buscar(id: string) {
    return this.http.get<TipoAdministrador>(`${_SERVER}/api/administrador/${id}`);
  }

  editar(administrador: any) {
    delete administrador.id_Administrador;
    return this.http.put<any>(`${_SERVER}/api/administrador/${administrador.identificacion}`, administrador);
  }
}
