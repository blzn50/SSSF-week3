import { CatService } from './../cat.service';
import { Component, OnInit, Input } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {Location} from '@angular/common'; 
import { Cat } from '../cat';
import { Subscriber } from 'rxjs/Subscriber';

@Component({
  selector: 'app-cat-edit',
  templateUrl: './cat-edit.component.html',
  styleUrls: ['./cat-edit.component.css']
})
export class CatEditComponent implements OnInit {
  // @Input() cat: Cat;
  cat: any;
  catEditForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private cs: CatService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ) {
    this.createForm();
   }

  ngOnInit() {
    // console.log(this.route.snapshot.params['id']);
    this.route.params.subscribe(params => {
      this.cat = this.cs.getOneCat(params['id']).subscribe(res => {
        this.cat = res;
      })
    })
  }

  createForm(){
    this.catEditForm = this.fb.group({
      title: ['',Validators.required],
      category: ['', Validators.required],
      details: ['', Validators.required],
      image: ['']
    })
  }

  updateCat(data){
    let id = this.route.snapshot.params['id'];
    this.cs.updateCat(id, data)
      .subscribe(res => {
        this.router.navigate(['/cats']);
      }, (err) => {
        console.log(err);
      });
    // this.route.params.subscribe(params => {
    //   this.cs.updateCat(params['id'], data);
    //   console.log('update id'+data);
    //   // this.router.navigate(['/cats']);
    // });
    // this.cs.updateCat(this.catEditForm.id, this.catEditForm);
  }

}
