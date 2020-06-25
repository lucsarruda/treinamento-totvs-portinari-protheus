import { Observable } from 'rxjs';
import { LoginService } from './login.service';
import { Component, OnInit } from '@angular/core';
import {
  PoPageLogin, PoPageLoginRecovery,
  PoModalPasswordRecoveryType,
  PoModalPasswordRecovery,
  PoModalPasswordRecoveryComponent
} from '@po-ui/ng-templates';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor( private loginService : LoginService , private router : Router) { }

  ngOnInit(): void {
  }

  async loginSubmit(formData: PoPageLogin) {
    let login = formData.login
    let password = formData.password

    const retorno =  await this.loginService.login(login, password).toPromise()
    if (retorno){
      sessionStorage.setItem('refreshtoken', retorno['refresh_token']);
      sessionStorage.setItem('access_token', retorno['access_token']);
      this.loginService.setNextDataRefreshToken(retorno['expires_in'])  // chamada de calculo de tempo de expira��o
      this.router.navigate(['/home']);
    }

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (!this.loginService.isLogged()) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

}
