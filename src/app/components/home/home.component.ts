import { Component } from '@angular/core';
import { GridComponent } from "../grid/grid.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [GridComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor() { }
}
