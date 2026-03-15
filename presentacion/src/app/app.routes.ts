import { Routes } from '@angular/router';
import { Visitantes } from './components/visitantes/visitantes';
import { Home } from './components/home/home';
import { Visitas } from './components/visitas/visitas';
import { Login } from './components/login/login';
import { Administrador } from './components/administrador/administrador';


export // Ejemplo de rutas en app-routing.module.ts
const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'visitantes', component: Visitantes },
    { path: 'visitas', component: Visitas },
    { path: 'home', component: Home },
    {path: 'login',component:Login},
    {path:'administrador',component:Administrador}


//   { path: '', component: DashboardComponent, canActivate: [AuthGuard], children: [
//       { path: 'administradores', component: AdminListComponent },
//       { path: 'usuarios', component: UserListComponent },
//       { path: 'visitantes', component: VisitorListComponent },
//       { path: 'visitas', component: VisitListComponent },
//       { path: 'motivos', component: MotivoListComponent },
//       // ...otros hijos
//   ]},
//   { path: '**', redirectTo: '' }


];