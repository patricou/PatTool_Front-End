import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { KeycloakService } from 'app/keycloak/keycloak.service';
import { Member } from 'app/model/member';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class IotService {

  private API_URL: string = environment.API_URL;

  constructor(private _http: Http, private _keycloakService: KeycloakService) {
  }
  // Get the header with token for Keycloak Security
  private getHeaderWithToken(): Observable<Headers> {
    let tokenPromise1: Promise<string> = this._keycloakService.getToken();
    let tokenObservable1: Observable<string> = Observable.fromPromise(tokenPromise1);

    return tokenObservable1.map(token => {
      return new Headers({
        'Accept': 'application/json',
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + token
      })
    })
  }

  openOrClosePortail(user: Member): Observable<any> {
    return this.getHeaderWithToken().concatMap(headers =>
      this._http.post(this.API_URL + "opcl/", JSON.stringify(user), { headers: headers }));
  }

  testEThernetShield(user: Member): Observable<any> {
    return this.getHeaderWithToken().concatMap(headers =>
      this._http.post(this.API_URL + "testarduino/", JSON.stringify(user), { headers: headers }));
  }

}
