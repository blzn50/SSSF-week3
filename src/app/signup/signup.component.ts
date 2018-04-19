import { Router } from '@angular/router';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  credentials = {
    username: '',
    password: '',
  };
  message = '';

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
  }

  signup() {
    this.auth.signup(this.credentials).subscribe((res) => {
      console.log(res);
      this.router.navigateByUrl('/login');
    }, (err)=> {
      console.error(err);
      this.message = err.message.msg;
    })
  }

}
