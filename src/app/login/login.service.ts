
import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor( private http : HttpClient) { }

  private headers = { 'X-PO-Screen-Lock': 'true' , 'Accept': 'application/json; charset=UTF-8' };

  public isLogged() {
    return sessionStorage.getItem('access_token');
  }

  logout() {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refreshtoken');
    sessionStorage.removeItem('expires_date');
  }


  login(username: string, password: string) {
    return this.http.post<any>(`http://localhost:8086/rest/api/oauth2/v1/token`,{},{headers:this.headers, params: {grant_type:'password',password:password,username:username} })
  }

  setNextDataRefreshToken(secondsExpire) {
    let dataatual = new Date()
    dataatual.setSeconds(dataatual.getSeconds() + secondsExpire - 60);
    sessionStorage.setItem('expires_date',dataatual.toString())
    return dataatual;
  }

  refresh(refresh_token) {
    return this.http.post<any>(`http://localhost:8086/rest/api/oauth2/v1/token`, {}, { headers: this.headers, params: { grant_type: 'refresh_token', refresh_token: refresh_token } })
  }

}
