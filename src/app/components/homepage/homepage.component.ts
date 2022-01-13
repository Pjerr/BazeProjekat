import { Component, OnInit } from '@angular/core';
import { ModalService } from '../_modal';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  constructor(private modalService: ModalService) { }

  userLoggedIn: boolean = false;
  //SAMO AKO je role u prikazujemo for you dugme
  userRole: string = "u";

  ngOnInit(): void {
  }

  openModalForLogin(){
    this.modalService.open("login");
  }

  closeModalForLogin(){
    this.modalService.close("login");
  }

  openModalForRegister(){
    this.modalService.open("register");
  }

  closeModalForRegister(){
    this.modalService.close("register");
  }

  login(){
    console.log("should login!");
  }

  register(){
    console.log("should register!");
  }

}
