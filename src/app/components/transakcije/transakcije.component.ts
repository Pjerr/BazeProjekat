import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, Subject, Subscription, take, takeUntil } from 'rxjs';
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
    if (this.userRole === 'p') this.initGradAndAdresaProdavniceRadnik();
    else if (this.userRole === 'a') this.initSviGradoviIAdrese();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  //SUBS
  destroy$: Subject<boolean> = new Subject();
  //OBV
  prodavnice: Observable<Prodavnica[]> | undefined = undefined;
  transakcije: any | undefined = undefined; //NE ZNAM STA DOBIJAM TACNO, mozda mogu da napravim model za to i cak bi i trebalo
  prodavnica: Prodavnica | undefined = undefined;
  //HELP VARS
  meseci = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAJ',
    'JUN',
    'JUL',
    'AVG',
    'SEP',
    'OKT',
    'NOV',
    'DEC',
  ];
  userRole = 'a';
  gradRadnika: string = '';
  adresaRadnika: string = '';

  gradovi: string[] = [];
  gradIzabran: boolean = false;
  adrese: string[] = [];

  transakcijeForm = new FormGroup({
    godina: new FormControl(''),
    kvartal: new FormControl(''),
    mesec: new FormControl(''),
    grad: new FormControl(''),
    adresa: new FormControl(''),
  });

  initGradAndAdresaProdavniceRadnik() {
    this.neoRadnikService
      .getInfoOProdavniciUKojojRadiRadnik('todor.kalezic')
      .pipe(takeUntil(this.destroy$))
      .subscribe((prodavnica: Prodavnica) => {
        this.prodavnica = prodavnica;
        this.gradRadnika = this.prodavnica.grad;
        this.adresaRadnika = this.prodavnica.adresa;
      });
  }

  initSviGradoviIAdrese() {
    this.neoProdavnicaService
      .getAllProdavnice()
      .pipe(takeUntil(this.destroy$))
      .subscribe((prodavnice) => {
        console.log(prodavnice);
        prodavnice.forEach((prodavnica) => {
          const nadjenGrad = this.gradovi.find((grad:string)=> grad === prodavnica.grad);
          if(!nadjenGrad)
            this.gradovi.push(prodavnica.grad);
        });
      });
  }

  pretraziTransakcije() {
    const paramsForSearch = this.transakcijeForm.value;
    console.log(paramsForSearch);
    let godina = paramsForSearch.godina;
    let kvartal = paramsForSearch.kvartal;
    let mesec = paramsForSearch.mesec;
    let grad = '';
    let adresa = '';

    if (this.userRole === 'p') {
      this.casTransakcijaService
        .getTransakcijeProdavnice(
          parseInt(godina),
          parseInt(kvartal),
          mesec,
          this.gradRadnika,
          this.adresaRadnika
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe((info) => {
          if (info.length > 0) {
            this.transakcije = info;
          } else
            this.toastrService.info(
              'Ne postoje transakcije u ovom periodu',
              'Info'
            );
        });
    } else {
      grad = paramsForSearch.grad;
      adresa = paramsForSearch.adresa;
      this.casTransakcijaService
      .getTransakcijeProdavnice(
        parseInt(godina),
        parseInt(kvartal),
        mesec,
        grad,
        adresa
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((info) => {
        if (info.length > 0) {
          this.transakcije = info;
        } else
          this.toastrService.info(
            'Ne postoje transakcije u ovom periodu',
            'Info'
          );
      });
    }
  }

  izaberiGrad(){
    const grad = this.transakcijeForm.value.grad;
    this.neoProdavnicaService.getProdavniceUGradu(grad).pipe(takeUntil(this.destroy$)).subscribe((info)=>{
      info.forEach(element => {
        this.adrese.push(element.adresa);
      });
    })
    this.gradIzabran = true;
  }
}
