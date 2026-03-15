import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Token } from '../../services/token';
import { AuthService } from '../../services/auth-service';


export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // en el req es donde va la peticion que se va a interceptar
  // next es el siguiente interceptor o el servicio que va a recibir la peticion
 const ServToken = inject(Token);// TRAIGO EL SERVICIO TOKEN Y JALO EL TOKEN EN LA SITNEGIE LINEA 
  const token = ServToken.getToken();

  const authService = inject(AuthService);
  const isLogged = authService.isLoggedIn();
  //

  if (isLogged) {
    //HAGO UN CLONE DEL REQ PARA NO MODIFICAR EL ORIGINAL
    // Y LE AGREGO EL HEADER DE AUT 
    const cloneReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloneReq);
  }

  return next(req);
};
