import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of, Subscription, take } from 'rxjs';
import { ProductDto } from 'src/app/models/product/productDto';
import { AppState } from 'src/app/store/app.state';
import * as CartActions from '../../store/cart/cart.actions';
import { CasProizvodService } from 'src/app/services/cas-proizvod.service';
import { NeoProizvodService } from 'src/app/services/neo-proizvod.service';
import { NeoKorisnikService } from 'src/app/services/neo-korisnik.service';
import * as CartSelectors from '../../store/cart/cart.selectors';
import { UserKomentar } from 'src/app/models/user/userComment';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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
    private toastrService: ToastrService
  ) {}

  //SUBS
  productSub: Subscription | undefined = undefined;
  ratingSub: Subscription | undefined = undefined;
  commentSub: Subscription | undefined = undefined;
  //OBJECTS
  product: ProductDto | undefined = undefined;
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
    this.productSub?.unsubscribe();
    this.commentSub?.unsubscribe();
    this.ratingSub?.unsubscribe();
  }

  loadProduct(kategorija: string, tip: string, naziv: string) {
    this.productSub = this.casProizvodService
      .getCassandraProizvodi(kategorija, tip, naziv, '', 'Naziv', 0)
      .pipe(take(1))
      .subscribe((product) => {
        this.product = product[0];
        this.loadAllComments(this.product.naziv);
      });
  }

  //Would get more than a string, probably something like an object holding a comment and some user info
  loadAllComments(nazivProizvoda: string): void {
    this.comments =
      this.neoProizvodService.getAllCommentsForProduct(nazivProizvoda);
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

        this.commentSub = this.neoKorisnikService
          .leaveComment(forSend.username, forSend.komentar, forSend.naziv)
          .subscribe(() => {
            setTimeout(() => {
              if (this.product) {
                console.log('loading new comments!');
                this.loadAllComments(this.product.naziv);
              }
            });
          });
      }
    } else {
      //toster service
      console.log('POPUNI POLJE!');
    }
  }

  openRating(): void {
    if (!this.rated) {
      this.clickedOnRate = true;
    }
  }

  //TODO: kada se obezbedi log in, ide username korisnika! fix
  rateProduct(rating: number): void {
    if (this.product) {
      const naziv = this.product.naziv;
      this.ratingSub = this.casProizvodService
        .updateCassandraOcenaProizvoda(this.product, rating)
        .subscribe(
          () => {
            setTimeout(() => {
              this.neoKorisnikService.rateProduct(
                'sasa.novkovic',
                rating,
                naziv
              );
            });

            setTimeout(() => {
              if (this.product) {
                const kategorija =
                  this.route.snapshot.queryParamMap.get('kategorija');
                const tip = this.route.snapshot.queryParamMap.get('tip');
                const naziv = this.route.snapshot.queryParamMap.get('naziv');
                if (kategorija != null && tip != null && naziv != null) {
                  this.loadProduct(kategorija, tip, naziv);
                }
              }
            });
          },
          () => this.toastrService.error('Doslo je do greske', 'Error')
        );

      this.rated = true;
      this.clickedOnRate = false;
    } else {
      //tostrService
      console.log('GRESKA PRI OCENJIVANJU');
    }
  }

  //TODO: implement cart, make an api call every time someone adds or removes something from cart?
  //QUESTION: how to make cart not remove items once you step out of the page?
  addToCart(): void {
    console.log('ADDING!');
    if (this.product) {
      this.store.dispatch(CartActions.addToCart({ product: this.product }));
      this.toastrService.success('Dodat proizvod u korpu', 'Success');
    }
  }

  removeFromCart(): void {
    console.log('REMOVING!');
    if (this.product) {
      this.store.dispatch(
        CartActions.removeFromCart({ product: this.product })
      );
      this.toastrService.info('Izbacen proizvod iz korpe', 'Info');
    }
  }
}
