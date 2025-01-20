import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  message: string = '';  // Property to hold success or error messages
  messageClass: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      usernameOrEmail: [
        '',
        [
          Validators.required,
          this.usernameOrEmailValidator, // Inline custom validator
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6), this.passwordPatternValidator]],
    });
  }

  // Inline validator function to validate both username and email
  usernameOrEmailValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    // Regular expression for a basic email check
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Define username criteria: Example, length greater than 3
    const usernamePattern = /^[a-zA-Z0-9_-]{3,}$/;

    // Check if the value matches either the email or username pattern
    if (emailPattern.test(value) || usernamePattern.test(value)) {
      return null; // valid
    }

    // If both fail, return an error
    return { invalidUsernameOrEmail: true };
  }

  passwordPatternValidator(control: AbstractControl): ValidationErrors | null {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (control.value && !passwordPattern.test(control.value)) {
      return { weakPassword: true };
    }
    return null;
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      console.log('Form is invalid');
      return;
    }

    const formData = this.loginForm.value;
    this.authService.login(formData).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        this.router.navigate(['/dashboard']);
        this.message = 'User logged in successfully!';
        this.messageClass = 'success';  // Success message
      },
      error: (err) => {
        if (err.status === 404) {
          this.message = 'User not found';
          this.messageClass = 'error';  // Error message
        } else if (err.status === 401) {
          this.message = 'Invalid password';
          this.messageClass = 'error';  // Error message
        } else {
          this.message = 'An error occurred. Please try again.';
          this.messageClass = 'error';  // Error message
        }
      },
    });
  }

  // Helper to access form controls in the template
  get f() {
    return this.loginForm.controls;
  }

  goToRegister() {
    console.log('Navigating to register page...');
    this.router.navigate(['/register']).catch(err => {
      console.error('Error navigating to register:', err);
    });
  }
}