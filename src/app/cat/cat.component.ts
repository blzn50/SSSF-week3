import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { CatService } from './../cat.service';
import { Cat } from '../cat';

@Component({
  selector: 'app-cat',
  templateUrl: './cat.component.html',
  styleUrls: ['./cat.component.css']
})
export class CatComponent implements OnInit, OnDestroy {
  subs: Subscription;
  selectedCat: Cat;
  cats: Cat[];
  term: any;

  constructor(
    private cs: CatService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.showCats();
  }

  // getSearch() {
  //   this.subs = this.cs.getSearch()
  //   .subscribe(res => {
  //     console.log('search term '+res);
  //     this.term = res
  //   });
  // }

  showCats() {
    this.cs.getCats()
      .subscribe(
        catsData => this.cats = catsData,
        err => {
          if (err.status === 401) {
            console.log(err);
            this.router.navigateByUrl('/login');
          }
        }
      );
  }

  showCat(id) {
    this.cs.getOneCat(id)
      .subscribe(
        data => this.selectedCat = data,
        err => {
          if (err.status === 401) {
            console.log(err);
            this.router.navigateByUrl('/login');
          }
        }
      );
  }

  deleteCat(id) {
    this.cs.deleteCat(id)
      .subscribe(() => {
        const item = this.cats.find(item => item.id === id);
        this.cats.splice(this.cats.indexOf(item));
      }, (err) => {
        console.log(err);
      });
  }

  ngOnDestroy() {
    // this.subs.unsubscribe();
  }

}
