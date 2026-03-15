import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';// Initialize Flowbite for styling and components
import { SideVar } from './components/side-var/side-var';
import { Visitantes } from './components/visitantes/visitantes';
import { Home } from './components/home/home';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,SideVar,Header,Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected title = 'hvpresentacion';

  ngOnInit() {
    initFlowbite(); // DESPUES DE LA IMPOTACION ADEMAS HACER EL ONINIT Y INITFLOWBITE
  }
}
