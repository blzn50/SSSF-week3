import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials = {
    username: '',
    password: '',
  };
  message = '';
  data: any;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
  }

  login() {
    this.auth.login(this.credentials).subscribe((res) => {
      this.data = res;
      localStorage.setItem('jwtToken', this.data.token);
      this.router.navigateByUrl('/cats');
    }, (err) => {
      this.message = err.error.msg;
      console.error(err);
    });
  }
}
