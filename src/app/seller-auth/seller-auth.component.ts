import { Component, OnInit } from '@angular/core';
import { SellerService } from '../services/seller.service';
import { Router } from '@angular/router';
import { login, signUp } from 'src/models/data-type';

@Component({
  selector: 'app-seller-auth',
  templateUrl: './seller-auth.component.html',
  styleUrls: ['./seller-auth.component.scss'],
})
export class SellerAuthComponent implements OnInit {
  isLogin = false;
  authError = '';
  constructor(private sellerService: SellerService, private router: Router) {}

  ngOnInit(): void {
    this.sellerService.reloadSeller();
  }

  signUp(data: signUp) {
    this.sellerService.userSingUp(data);
    this.sellerService.isSingupError.subscribe((isError) => {
      if (isError) {
        this.authError = 'All field are required';
      }
    });
  }
  login(data: login) {
    this.sellerService.userLogin(data);
    this.sellerService.isLoginError.subscribe((isError) => {
      if (isError) {
        this.authError = 'Email or Password is not correct';
      }
    });
  }

  SingUpLogin(type: string) {
    if (type === 'login') {
      this.isLogin = true;
    } else if (type === 'signup') {
      this.isLogin = false;
    } else {
      this.isLogin = false;
    }
  }
}
