import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent implements OnInit {
  info_inscription = "";

  constructor() { }

  ngOnInit(): void {
  }

  inscription(): void {
    this.info_inscription = "Une erreur est survenu.";
  }
}
