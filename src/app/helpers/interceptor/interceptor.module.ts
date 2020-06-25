import { catchError, take, switchMap, finalize } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { LoginService } from './../../login/login.service';
import { NgModule, Injectable } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpInterceptor, HttpRequest, HttpHandler, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent, HttpErrorResponse } from '@angular/common/http';
import { PoNotificationService } from '@po-ui/ng-components';
import { Router } from '@angular/router';

@Injectable()
export class HttpsRequestInterceptor implements HttpInterceptor {
  constructor(private thfNotification: PoNotificationService,
      private loginService: LoginService,
      private router: Router,
     ) {
  }
  private isRefreshingToken = false;
  //private tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  intercept(
      request: HttpRequest<any>,
      next: HttpHandler,
  ): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any> | any> {

    let dataAtual = new Date()
    let dataExpire =  new Date(sessionStorage.getItem('expires_date'))

    if ( !this.isRefreshingToken && dataAtual >= dataExpire && sessionStorage.getItem('access_token')) {
        this.isRefreshingToken = true;

        return this.loginService.refresh(sessionStorage.getItem('refreshtoken'))
            .pipe( take(1),
                switchMap((data) => {
                    console.log(data)
                    if (data) {
                        sessionStorage.setItem('access_token', data['access_token'])
                        sessionStorage.setItem('refreshtoken', data['access_token'])
                        this.loginService.setNextDataRefreshToken(data['expires_in'])
                        return next.handle(this.addTokenToRequest(request));
                    }
                    return throwError(data);
                }),
                catchError(err => {
                    return throwError(err);
                }),
                finalize(() => {
                    this.isRefreshingToken = false;
                })
            );

    }

    // Adiciona o Token nas requisicoes
    if (!this.isRefreshingToken && sessionStorage.getItem('access_token')) {
        request = this.addTokenToRequest(request)
    }


    return next.handle(request)
        .pipe(
            catchError(err => {
                let cMsgRet = err.status + ' - ';
                if (err.error.errorMessage) {
                    cMsgRet += err.error.errorMessage
                } else if (err.error.message) {
                    cMsgRet += err.error.message
                } else {
                    cMsgRet += err.message
                }
                if (err instanceof HttpErrorResponse) {
                    switch ((<HttpErrorResponse>err).status) {
                        case 0:
                            this.thfNotification.error({ message: "Ops! Nosso servidor não está respondendo..." });
                            return throwError(cMsgRet);
                        case 401:
                            this.thfNotification.error({ message: cMsgRet });
                            this.loginService.logout()
                            this.router.navigate(['/login']);

                            return throwError(cMsgRet);

                        case 400:

                            this.thfNotification.error({ message: cMsgRet });
                            return throwError(cMsgRet);
                        default:
                            this.thfNotification.error({ message: cMsgRet });
                            return throwError(cMsgRet);
                    }
                } else {
                    this.thfNotification.error({ message: cMsgRet });
                    return throwError(cMsgRet);


                }
            }));
  }

  private addTokenToRequest(request: HttpRequest<any>): HttpRequest<any> {
      const headers = {
          'Accept': 'application/json; charset=UTF-8', // Quando enviado isso, o Protheus entende que deve converter para UTF8
          'Content-Type': 'application/json', // Solicita que a comunicacao seja no formato JSON
          'Authorization': 'Bearer ' + sessionStorage.getItem('access_token'), // Envia o TOKEN de autenticaoo
          'X-Portinari-No-Count-Pending-Requests': 'false' // Nao realiza a contagem
      };
      //console.log(this.configService.getHostRest())
      //console.log(`${this.configService.getHostRest()}/${request.url}`)
      //console.log(request.params)
      return request.clone({ setHeaders: headers });
  }


}


@NgModule({
  providers: [
      {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpsRequestInterceptor,
          multi: true,
      },
  ],
})
export class InterceptorModule { }
