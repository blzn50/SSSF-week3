import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,  ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CatComponent } from './cat/cat.component';
import { CatCreateComponent } from './cat-create/cat-create.component';
import { CatEditComponent } from './cat-edit/cat-edit.component';
import { CatService } from './cat.service';
import { AuthService } from './auth.service';
import { AppRoutingModule } from './app-routing.module';
import { FilterPipe } from './filter.pipe';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    CatComponent,
    CatCreateComponent,
    CatEditComponent,
    FilterPipe,
    SignupComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule, FormsModule,  HttpClientModule, ReactiveFormsModule, AppRoutingModule
  ],
  providers: [CatService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
