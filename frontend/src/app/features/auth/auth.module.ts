import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';  // Import ReactiveFormsModule
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
  ],
  imports: [
    CommonModule,  // Provides common directives like ngIf, ngFor
    ReactiveFormsModule,  // Enables reactive forms
  ],
  exports: [
    LoginComponent,
    RegisterComponent,
  ],
})
export class AuthModule { }
