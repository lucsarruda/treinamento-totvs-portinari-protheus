
import { LoginService } from './login/login.service';
import { Component } from '@angular/core';

import { PoMenuItem } from '@po-ui/ng-components';
import { Router } from '@angular/router';

import { LoginComponent } from './login/login.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor( public loginService : LoginService , private router : Router){

  }

  readonly menus: Array<PoMenuItem> = [
    { label: 'Home', link:'\home' },
    // { label: 'Login', link:'\login' },
    { label: 'Clientes', link:'\client-list' },
    // { label: 'Clientes',  action: () => ( alert("Teste") )  },
    {
      label: 'Sair', action: () => (this.loginService.logout(),
        this.router.navigate([`login`]))
    },
  ];

  private onClick() {
    alert('Clicked in menu item')
  }

}
