import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription, Observable, timer } from 'rxjs';
import { Contact } from '../contact';
import { UserService } from '../service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  @Input() contact: Contact;
  user_connecter = null;
  message_envoyer = new FormControl();
  
  message = {
    identite: 'toty',
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  };

  message_cuda = {
    identite: 'cuda',
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  };

  messages = [];
  subscription: Subscription;
  constructor(private userService: UserService) { }
  everySecond: Observable<number> = timer(1000,5000);

  ngOnInit(): void {
    this.userService.currentUser.subscribe(user => this.user_connecter = user);
  }

  ngOnChanges(): void {
    this.messages = [];
    if(this.contact != undefined){
      this.getMessages();
      this.subscription = this.everySecond.subscribe((seconds) => {
        this.getMessages();
      });
    }
  }

  //this.subscription.unsubscribe();
  getMessages(): void {
    const url = "https://trankillprojets.fr/wal/wal.php?lire&identifiant="+this.user_connecter.identifiant+"&relation="+this.contact.relation;
    
    var self = this;
    fetch(url)
    .then((response) => response.json())
    .then(function(data) {
      console.log(data);
      if(data.etat.reponse == "1" && data.messages.length > 0){
        data.messages.forEach(element => {
          self.messages.push(element);
        });
      }
    });
  }

  envoyer_message(): void{
    console.log("img");
    if(this.message_envoyer.value != null){
      const url = "https://trankillprojets.fr/wal/wal.php?ecrire&identifiant="+this.user_connecter.identifiant+"&relation="+this.contact.relation+"&message="+this.message_envoyer.value;
      const message = {
        identite: this.user_connecter.pseudo,
        message: this.message_envoyer.value
      };

      var self = this;
      fetch(url)
      .then((response) => response.json())
      .then(function(data) {
        if(data.etat.reponse == "1"){
          self.messages.push(message);
          self.message_envoyer.setValue("");
        }
      });
    }
  }

  supprimer_contact(): void {
    const url = "https://trankillprojets.fr/wal/wal.php?delier&identifiant="+this.user_connecter.identifiant+"&relation="+this.contact.relation;
    var self = this;
    fetch(url)
    .then((response) => response.json())
    .then(function(data) {
      if(data.etat.reponse == "1"){
        self.contact = null;
      }
    });
  }
}
