import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { Radnik } from 'src/app/models/user/radnik';
import { NeoRadnikService } from 'src/app/services/neo-radnik.service';
import { ModalService } from '../../_modal';

interface CeoRadnik {
  radnik: Radnik;
  zaposlenje: any;
  prodavnica: any;
}

@Component({
  selector: 'app-a-radnici',
  templateUrl: './a-radnici.component.html',
  styleUrls: ['./a-radnici.component.scss'],
})
export class ARadniciComponent implements OnInit, OnDestroy {
  constructor(
    private neoRadnikService: NeoRadnikService,
    private modalService: ModalService,
    private toastrService: ToastrService
  ) {}

  destroy$: Subject<boolean> = new Subject<boolean>();
  radnici: Observable<Radnik[]> | undefined = undefined;
  selectedRadnik: Radnik | undefined = undefined;

  novaPoz: FormControl = new FormControl('');

  zaposliForm: FormGroup = new FormGroup({
    username: new FormControl(''),
    grad : new FormControl(''),
    adresa: new FormControl(''),
    pozicija: new FormControl(''),
    datum: new FormControl(''),
  });

  addForm: FormGroup = new FormGroup({
    username: new FormControl(''),
    ime : new FormControl(''),
    prezime: new FormControl(''),
    password: new FormControl(''),
  });

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {
    this.loadRadnici();
  }

  loadRadnici() {
    this.radnici = this.neoRadnikService.getAllRadnici();
  }

  //OVO SE OKIDA SAMO AKO NEMA PRODAVNICU U KOJOJ RADI
  zaposliRadnika(username: string) {

  }

  izmeniRadnika(radnik: Radnik) {
    //NA KRAJU API POZIVA RESETUJ FORM CONTROL
    //TREBA MI I GRAD I ADRESA DA BIH MOGAO DA PROMENIM POZ
    this.novaPoz.setValue('');
  }

  otpustiRadnika(radnik: Radnik) {
    //TREBA MI GRAD I ADRESA DA BIH OTPUSTIO RADNIKA
  }

  izbrisiRadnika(username: string) {
    // this.neoRadnikService.deleteRadnik(username).subscribe(() => {
    //   this.toastrService.success('Uspesno obrisan radnik iz baze', 'Success');
    // });
  }

  dodajRadnika() {
    const radnikToAdd: Radnik = {
      ime: this.addForm.value.ime,
      prezime: this.addForm.value.prezime,
      username: this.addForm.value.username,
      password: this.addForm.value.password
    }
    this.addForm.reset();
    console.log(radnikToAdd);
    // this.neoRadnikService.addRadnik(radnikToAdd).pipe(takeUntil(this.destroy$)).subscribe(()=>{
    //   this.toastrService.success("Uspesno dodat radnik", "Success");
    //   this.modalService.close('dodajRadnikModal');
    // })
  }

  openModal(modalID: string, radnik?: Radnik) {
    if(radnik)
      this.selectedRadnik = radnik;
    this.modalService.open(modalID);
  }

  closeModal(modalID: string) {
    this.modalService.close(modalID);
  }
}
