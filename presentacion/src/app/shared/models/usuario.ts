export class User {
  id: number | string;
  nombre: string;
  rol: string   ;  

 constructor(user?:User) {
    this.id =user !== undefined ? user.id : ''
    this.nombre = user !== undefined ? user.nombre : '';
    this.rol = user !== undefined ? user.rol : '';
  }
}