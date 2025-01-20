import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
 
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {
this.loginForm = this.fb.group({
usernameOrEmail: ['', [Validators.required, this.usernameOrEmailValidator,]],
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
 
  onSubmit() {
    if (this.loginForm.valid) {
      // Extract form values
      const credentials = this.loginForm.value;
      console.log("login detailss :",credentials);

      // Call the login method of AuthService
      this.authService.login(credentials).subscribe(
      
        (response: { token: any; }) => {
          // Assuming the response contains the JWT token
          console.log("response",response);
          const token = response.token;
          console.log("token",token);
          if (token) {
            // Store the token in localStorage
            localStorage.setItem('token', token);

            alert('Login successful!');
           // this.toastr.success('Login successful!', 'Success');
            // Redirect to dashboard after successful login
            this.router.navigate(['/dashboard']);
          }
        },
        (error: any) => {
          alert('Login failed. Please check your credentials and try again.');
        //  this.toastr.error('Login failed. Please check your credentials and try again.', 'Error');
          console.error('Login failed', error);
        }
      );
    }
  }

  redirectToRegister(): void {
    this.router.navigate(['/register']);
  }
}