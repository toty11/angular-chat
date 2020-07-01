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
  message = "";
  message_envoyer = new FormControl();
  
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
    if(this.contact != undefined || this.contact != null){
      this.getMessages();
      this.subscription = this.everySecond.subscribe((seconds) => {
        this.getMessages();
      });
    }
  }

  getMessages(): void {
    const url = "https://trankillprojets.fr/wal/wal.php?lire&identifiant="+this.user_connecter.identifiant+"&relation="+this.contact.relation;
    
    var self = this;
    fetch(url)
    .then((response) => response.json())
    .then(function(data) {
      if(data.etat.reponse == "1" && data.messages.length > 0){
        data.messages.forEach(element => {
          var d = new Date(Number(self.getMetaData(element.message,"<t>","</t>")) * 1000);
          const message = {
            identite: element.identite,
            message: self.getMetaData(element.message,"<m>","</m>"),
            time: self.addZero(d.getHours())+":"+self.addZero(d.getMinutes())
          };
          if(self.messages.find(e => e.message === message.message && e.time === message.time) === undefined){
            self.messages.push(message);
          }
        });
      }
    });
  }

  //Pour le formatage de l'heure ajoute des zéros
  addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

  envoyer_message(): void{
    if(this.message_envoyer.value != null && this.message_envoyer.value != ""){
      const message_metaData = this.ajouterMetaData(this.message_envoyer.value);
      const url = "https://trankillprojets.fr/wal/wal.php?ecrire&identifiant="+this.user_connecter.identifiant+"&relation="+this.contact.relation+"&message="+message_metaData;
      var d = new Date(Number(this.getMetaData(message_metaData,"<t>","</t>")) * 1000);
      const message = {
        identite: this.user_connecter.pseudo,
        message: this.message_envoyer.value,
        time: this.addZero(d.getHours())+":"+this.addZero(d.getMinutes())
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

  //Ajoute metadata timestamp, message
  ajouterMetaData(message): string{
    return "<t>"+Math.floor(Date.now() / 1000)+"</t><m>"+message+"</m>";
  }

  //Permet de récupérer la metadata qui nous intéresse
  getMetaData(message, baliseOuvrante, baliseFermante){
    var debut = message.indexOf(baliseOuvrante);
    var fin = message.indexOf(baliseFermante);
    return message.substring(debut+3,fin);
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
