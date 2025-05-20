import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  mot_de_passe = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    if (!this.email || !this.mot_de_passe) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }

    this.authService.login(this.email, this.mot_de_passe).subscribe({
      next: (res) => {
        if (res && res.access_token) {
          this.authService.saveToken(res.access_token);
          this.router.navigate(['/patients']); // Bien rediriger vers /patients
        } else {
          this.errorMessage = 'Réponse invalide du serveur.';
        }
      },
      error: (err) => {
        console.error('Erreur lors du login:', err);
        this.errorMessage =
          err.error?.error || 'Email ou mot de passe incorrect';
      }
    });
  }
} 
