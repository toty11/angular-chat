import { Component, OnInit, Input } from '@angular/core';
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
  message = {
    identite: 'toty',
    message: 'message de toty'
  };

  message_cuda = {
    identite: 'cuda',
    message: 'message de cuda'
  };

  messages = [this.message,this.message,this.message, this.message_cuda, this.message_cuda, this.message, this.message_cuda, this.message, this.message,this.message,this.message,this.message,this.message_cuda,this.message_cuda,this.message_cuda,this.message_cuda,this.message_cuda,this.message_cuda,this.message_cuda,this.message_cuda,this.message_cuda,this.message_cuda,this.message_cuda,this.message_cuda];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.currentUser.subscribe(user => {this.user_connecter = user; console.log(user)});
    console.log(this.message_cuda.identite);
    console.log(this.user_connecter.pseudo);
    console.log(this.user_connecter.identite === this.message_cuda.identite);
    if(this.contact != undefined){
      this.getMessages();
    }
  }

  getMessages(): void {
    console.log(this.contact.relation);
    const url = "https://trankillprojets.fr/wal/wal.php?lire&identifiant="+this.user_connecter.identifiant+"&relation="+this.contact.relation;
    
    var self = this;
    fetch(url)
    .then((response) => response.json())
    .then(function(data) {
      if(data.etat.reponse == "1"){
        self.messages = data.messages;
      }
    });
  }
}
