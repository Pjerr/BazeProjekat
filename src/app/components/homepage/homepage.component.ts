import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  })

  registerForm = new FormGroup({
    email: new FormControl(''),
    ime: new FormControl(''),
    prezime: new FormControl(''),
    telefon: new FormControl(''),
    password: new FormControl('')
  })

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
    console.log(this.loginForm.value);
  }

  register(){
    console.log("should register!");
    console.log(this.registerForm.value);
  }

}
