import { Component, inject } from '@angular/core';
import { Nav } from "../Layout/nav/nav";
import { Router, RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [Nav, RouterOutlet, NgClass],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected router = inject(Router);


}
