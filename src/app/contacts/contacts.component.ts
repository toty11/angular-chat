import { Component, OnInit, Input } from '@angular/core';
import { Contact } from '../contact';
import { User } from '../user';
import { UserService } from '../service';


@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
   
  user_connecter = null;
  selectedContact: Contact;
  contacts = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.currentUser.subscribe(user => this.user_connecter = user);
    this.getContacts();
  }
  
  onSelect(contact: Contact): void {   
    this.selectedContact = contact;
  }

  getContacts(): void{
    const url = "https://trankillprojets.fr/wal/wal.php?relations&identifiant="+this.user_connecter.identifiant;
    
    var self = this;
    fetch(url)
    .then((response) => response.json())
    .then(function(data) {
      if(data.etat.reponse == "1"){
        self.contacts = data.relations;
      }
    });
  }
}
