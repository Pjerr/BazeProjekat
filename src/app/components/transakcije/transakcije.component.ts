import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, Subscription, take } from 'rxjs';
import { Prodavnica } from 'src/app/models/prodavnica';
import { CasTransakcijaService } from 'src/app/services/cas-transakcija.service';
import { NeoProdavnicaService } from 'src/app/services/neo-prodavnica.service';
import { NeoRadnikService } from 'src/app/services/neo-radnik.service';

@Component({
  selector: 'app-transakcije',
  templateUrl: './transakcije.component.html',
  styleUrls: ['./transakcije.component.scss'],
})
export class TransakcijeComponent implements OnInit, OnDestroy {
  constructor(
    private toastrService: ToastrService,
    private neoProdavnicaService: NeoProdavnicaService,
    private casTransakcijaService: CasTransakcijaService,
    private neoRadnikService: NeoRadnikService
  ) {}

  ngOnInit(): void {
    this.initGradAndAdresaProdavnice();
    // this.prodavniceSub = this.neoProdavnicaService.getAllProdavnice().subscribe((prodavnice)=>{
    //   console.log(prodavnice);
    //   prodavnice.forEach(prodavnica => {
    //     this.gradovi.push(prodavnica.grad);
    //     this.adrese.push(prodavnica.adresa);
    //   });
    // })
  }

  ngOnDestroy(): void {
    this.prodavniceSub?.unsubscribe();
  }

  //SUBS
  prodavniceSub: Subscription | undefined = undefined;
  //OBV
  prodavnice: Observable<Prodavnica[]> | undefined = undefined;
  transakcije: any | undefined = undefined;  //NE ZNAM STA DOBIJAM TACNO, mozda mogu da napravim model za to i cak bi i trebalo
  prodavnica: Prodavnica | undefined = undefined;
  //HELP VARS
  meseci = ["JAN", "FEB", "MAR", "APR", "MAJ", "JUN", "JUL", "AVG", "SEP", "OKT", "NOV", "DEC"];
  userRole = 'p';
  gradRadnika : string = "";
  adresaRadnika: string = "";

  gradovi: string[] = [];
  adrese: string[] = [];

  transakcijeForm = new FormGroup({
    godina: new FormControl(''),
    kvartal: new FormControl(''),
    mesec: new FormControl(''),
    grad: new FormControl(''),
    adresa: new FormControl(''),
  });

  initGradAndAdresaProdavnice() {
    this.neoRadnikService
      .getInfoOProdavniciUKojojRadiRadnik('todor.kalezic').pipe(take(1))
      .subscribe((prodavnica: Prodavnica) => {
        this.prodavnica = prodavnica;
        this.gradRadnika = this.prodavnica.grad;
        this.adresaRadnika = this.prodavnica.adresa
      });
  }

  pretraziTransakcije() {
    const paramsForSearch = this.transakcijeForm.value;
    console.log(paramsForSearch);
    let godina = paramsForSearch.godina;
    let kvartal = paramsForSearch.kvartal;
    let mesec = paramsForSearch.mesec;
    if(!this.prodavnica){
      let grad = paramsForSearch.grad;
      let adresa = paramsForSearch.adresa;
    }

    if(this.userRole === "p"){
      this.casTransakcijaService.getTransakcijeProdavnice(parseInt(godina), parseInt(kvartal), mesec, this.gradRadnika, this.adresaRadnika).subscribe((info)=>{
        if(info.length > 0){
          this.transakcije = info;
        }
        else this.toastrService.info("Ne postoje transakcije u ovom periodu", "Info");
      });
    } else{
      //ADMIN DEO!
    }

    //API CALL
    //this.transakcije = this.casTransakcijaService.getTransakcijeProdavnice(godina, kvartal, mesec, grad, adresa);
  }
}
