import { CatService } from './../cat.service';
import { Cat } from './../cat';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-cat-create',
  templateUrl: './cat-create.component.html',
  styleUrls: ['./cat-create.component.css']
})
export class CatCreateComponent implements OnInit {
  // newCat: Cat[];
  selectedFile: File = null;
  constructor(private cs: CatService) { }

  ngOnInit() {
  }

  file(event){
    this.selectedFile = <File>event.target.files[0];
  }

  submit(form: NgForm){
    if(form.valid){
      let formData:any = new FormData();
      formData.append('title', form.value.title.trim());
      formData.append('category', form.value.category.trim());
      formData.append('details', form.value.details.trim());
      formData.append('image', this.selectedFile, this.selectedFile.name);

      console.log('cat created');
      this.cs.addCat(formData)
      .subscribe(res => console.log('cat added'));
    } 

  }
}
