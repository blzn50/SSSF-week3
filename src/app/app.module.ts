import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,  ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CatComponent } from './cat/cat.component';
import { CatCreateComponent } from './cat-create/cat-create.component';
import { CatEditComponent } from './cat-edit/cat-edit.component';
import { CatService } from './cat.service';
import { AppRoutingModule } from './app-routing.module';
import { FilterPipe } from './filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    CatComponent,
    CatCreateComponent,
    CatEditComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule, FormsModule,  HttpClientModule, ReactiveFormsModule, AppRoutingModule
  ],
  providers: [CatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
