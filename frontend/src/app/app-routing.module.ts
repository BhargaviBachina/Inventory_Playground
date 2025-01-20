import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/components/login/login.component';  
import { RegisterComponent } from './features/auth/components/register/register.component';
import { AuthGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './features/auth/components/dashboard/dashboard.component';  

const routes: Routes = [
  
  { path: 'login', component: LoginComponent },  
  { path: 'register', component: RegisterComponent },  
  { path: '', redirectTo: '/login', pathMatch: 'full' },  
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] }, 
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],  
  exports: [RouterModule]  
})
export class AppRoutingModule { }
