import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  usernameExistsMessage: string = '';
  isLoading: boolean = false;  // New loading state
  successMessage: string = '';  // Success message state
  errorMessage: string = '';  // Error message state

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(3)]],
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          this.usernamePatternValidator, // Username pattern validation
        ],
      ],
      email: [
        '',
        [Validators.required, Validators.email],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          this.passwordPatternValidator, // Password pattern validation
        ],
      ],
    });
  }

  // Custom Validator for username (Alphanumeric and Unique)
  usernamePatternValidator(control: AbstractControl): ValidationErrors | null {
    const usernamePattern = /^[a-zA-Z0-9_-]{3,}$/; // Alphanumeric or underscore, length >= 3
    if (control.value && !usernamePattern.test(control.value)) {
      return { invalidUsername: true };
    }
    return null;
  }

  // Custom Validator for strong password
  passwordPatternValidator(control: AbstractControl): ValidationErrors | null {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (control.value && !passwordPattern.test(control.value)) {
      return { weakPassword: true };
    }
    return null;
  }

  // Check if the username is already taken (using the AuthService)
  checkUsernameExists(username: string): void {
    this.authService.checkUsernameExists(username).subscribe({
      next: (exists: boolean) => {
        if (exists) {
          this.usernameExistsMessage = 'Username already exists. Try another one.';
          this.registerForm.controls['username'].setErrors({ usernameExists: true });
        } else {
          this.usernameExistsMessage = '';
        }
      },
      error: (err) => {
        console.error('Error checking username existence', err);
      },
    });
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      // Handle invalid form
      console.log('Form is invalid');
      return;
    }

    const formData = this.registerForm.value;

    // Check if username exists before submitting the registration
    this.checkUsernameExists(formData.username);

    // Set loading state to true
    this.isLoading = true;
    this.successMessage = '';  // Clear success message before re-submitting
    this.errorMessage = '';  // Clear any previous error message

    setTimeout(() => {
      if (this.registerForm.invalid) {
        this.isLoading = false;  // Stop loading if invalid
        return; // If username already exists, don't proceed
      }

      this.authService.register(formData).subscribe({
        next: () => {
          this.successMessage = 'User registered successfully! You will be redirected to the login page shortly.';
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 2000); // Navigate after 2 seconds
        },
        error: (err) => {
          console.error(err.message); // Handle error
          this.errorMessage = 'An error occurred during registration. Please try again.';
        },
        complete: () => {
          this.isLoading = false;  // Stop loading after registration attempt
        }
      });
    }, 500);
  }

  // Helper to access form controls in the template
  get f() {
    return this.registerForm.controls;
  }

  ngOnInit() {
    console.log('Current route:', this.router.url);
  }

  goToLogin() {
    console.log('Navigating to login page...');
    this.router.navigate(['/login']).catch((err) => {
      console.error('Error navigating to login:', err);
    });
  }
}
