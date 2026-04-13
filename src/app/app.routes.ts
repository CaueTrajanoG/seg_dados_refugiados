import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { CadastroComponent } from './components/cadastro/cadastro';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];