import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
//import { PersonsComponent } from './persons/persons.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    //PersonsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'myFrontend_v1';
}
