import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { PersonComponent } from './person/person.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    PersonComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'myFrontend_v1';
  message: { text: string; type: string } | null = null;
}
