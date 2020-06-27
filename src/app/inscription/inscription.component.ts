import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent implements OnInit {
  info_inscription = "";

  response = 0;
  pseudo = new FormControl();
  email = new FormControl();
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  
  }

  inscription(): void {
    const url = "https://trankillprojets.fr/wal/wal.php?inscription&identite="+this.pseudo.value+"&mail="+this.email.value;
    
    var self = this;
    fetch(url)
    .then((response) => response.json())
    .then(function(data) {
      console.log(data);
      if(data.etat.reponse == "1"){
        self.response = 1;
        self.info_inscription = data.etat.message;
        self.pseudo.setValue('');
        self.email.setValue('');
      }else{
        self.response = 0;
        self.info_inscription = data.etat.message;
      }
    });
  }
}
