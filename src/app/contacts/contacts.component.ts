import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
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
  email_contact = new FormControl();
  contacts = [];
  el:HTMLElement;

  constructor(private userService: UserService, el: ElementRef) { this.el = el.nativeElement}

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

  show_input_ajout_contact(): void {
    const input_ajout_contact = document.getElementById('input-ajout-contact');
    input_ajout_contact.style.display = "block";
  }

  hide_input_ajout_contact(): void {
    const input_ajout_contact = document.getElementById('input-ajout-contact');
    input_ajout_contact.style.display = "none";
  }

  ajout_contact(): void {
    if(this.email_contact.value != null){
      const url = "https://trankillprojets.fr/wal/wal.php?lier&identifiant="+this.user_connecter.identifiant+"&mail="+this.email_contact.value;
    
      var self = this;
      fetch(url)
      .then((response) => response.json())
      .then(function(data) {
        if(data.etat.reponse == "1"){
          self.getContacts();
          self.email_contact.setValue("");
          self.hide_input_ajout_contact();
        }
      });
    }
  }

  randomBackgroundColor(){
    const color = [
      'bg-circle-yellow',
      'bg-circle-red',
      'bg-circle-green'
    ];

    const index = Math.floor(Math.random() * (color.length - 0));
    return index;
  }
}
