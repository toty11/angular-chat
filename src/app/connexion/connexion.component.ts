import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../user';
import { UserService } from '../service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent implements OnInit {

  info_connexion = "";
  identifiant = new FormControl();
  
  constructor(private router: Router, private userService: UserService) { }

  ngOnInit(): void {
  }

  connexion(): void {
    const url = "https://trankillprojets.fr/wal/wal.php?information&identifiant="+this.identifiant.value;
    
    var self = this;
    fetch(url)
    .then((response) => response.json())
    .then(function(data) {
      if(data.etat.reponse == "1"){
        const user = {
          identifiant: data.identifiant,
          pseudo: data.identite
        };
        
        self.userService.changeUser(user);
        self.router.navigate(["/acceuil"]);
      }
    });
  }
}
