import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of, Subject, Subscription, take, takeUntil } from 'rxjs';
import { ProductCass } from 'src/app/models/product/productCass';
import { AppState } from 'src/app/store/app.state';
import { CasProizvodService } from 'src/app/services/cas-proizvod.service';
import { NeoProizvodService } from 'src/app/services/neo-proizvod.service';
import { NeoKorisnikService } from 'src/app/services/neo-korisnik.service';
import { UserKomentar } from 'src/app/models/user/userComment';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit, OnDestroy, OnChanges {
  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private casProizvodService: CasProizvodService,
    private neoProizvodService: NeoProizvodService,
    private neoKorisnikService: NeoKorisnikService,
    private cartSerivce: CartService,
    private toastrService: ToastrService
  ) {}

  destroy$: Subject<boolean> = new Subject();
  //OBJECTS
  product: ProductCass | undefined = undefined;
  comments: Observable<UserKomentar[]> | undefined = undefined;
  //HELP VARS
  rated: boolean = false; //moramo da preuzmemo nekako od korisnika + da ogranicimo da mogu da ratuju samo oni koji su logovani
  clickedOnRate: boolean = false;
  userComment = new FormControl('');

  ngOnInit(): void {
    const kategorija = this.route.snapshot.queryParamMap.get('kategorija');
    const tip = this.route.snapshot.queryParamMap.get('tip');
    const naziv = this.route.snapshot.queryParamMap.get('naziv');
    if (kategorija != null && tip != null && naziv != null) {
      this.loadProduct(kategorija, tip, naziv);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.product) {
      const kategorija = this.route.snapshot.queryParamMap.get('kategorija');
      const tip = this.route.snapshot.queryParamMap.get('tip');
      const naziv = this.route.snapshot.queryParamMap.get('naziv');
      if (kategorija != null && tip != null && naziv != null) {
        this.loadProduct(kategorija, tip, naziv);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  loadProduct(kategorija: string, tip: string, naziv: string) {
    this.casProizvodService
      .getCassandraProizvodi(kategorija, tip, naziv, '', 'Naziv', 0)
      .pipe(takeUntil(this.destroy$))
      .subscribe((product) => {
        this.product = product[0];
        this.loadAllComments(this.product.naziv);
      });
  }

  //Would get more than a string, probably something like an object holding a comment and some user info
  loadAllComments(nazivProizvoda: string): void {
    this.comments =
      this.neoProizvodService.getKomentariIOceneZaProizvod(nazivProizvoda);
  }

  //TODO: popravi ovu fju, testiraj comment i rating!
  leaveComment(): void {
    if (this.userComment.value != '') {
      if (this.product) {
        const forSend = {
          username: 'sasa.novkovic',
          komentar: this.userComment.value,
          naziv: this.product.naziv,
        };

        this.neoKorisnikService
          .ostaviKomentar(forSend.username, forSend.komentar, forSend.naziv)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            complete: () => {
              setTimeout(() => {
                if (this.product) {
                  this.loadAllComments(this.product.naziv);
                }
              });
            },
            error: () => {
              this.toastrService.error(
                'Doslo je do greske prilikom komentarisanja',
                'Error'
              );
            },
          });
      }
    } else {
      //toster service
      this.toastrService.error(
        'Molimo vas popunite polje pre nego sto komentarisete',
        'Error'
      );
    }
  }

  //imamo iz baze bese proveru da je nesto ocenjeno?
  openRating(): void {
    if (!this.rated) {
      this.clickedOnRate = true;
    }
  }

  //TODO: kada se obezbedi log in, ide username korisnika! fix
  rateProduct(rating: number): void {
    if (this.product) {
      const naziv = this.product.naziv;
      const kategorija = this.product.kategorija;
      const tip = this.product.tip;

      //da li treba setTimeout ako imamo ovo complete?
      this.casProizvodService
        .updateCassandraOcenaProizvoda(this.product, rating)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          complete: () => {
            this.neoKorisnikService
              .oceniProizvod('sasa.novkovic', rating, naziv)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                complete: () => {
                  this.loadProduct(kategorija, tip, naziv);
                  this.toastrService.success(
                    'Oba api dobra za rate',
                    'Success'
                  );
                },
                error: () => {
                  this.toastrService.error(
                    'Doslo je do greske prilikom ocenjivanja',
                    'Error'
                  );
                },
              });
          },
        });

      this.rated = true;
      this.clickedOnRate = false;
    } else {
      this.toastrService.error('WHOPS', 'Error');
    }
  }

  addToCart(): void {
    if (this.product) {
      this.cartSerivce.addToCart(this.product);
      this.toastrService.success('Dodat proizvod u korpu', 'Success');
    }
  }
}
