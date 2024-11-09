import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { KeycloakService } from 'app/keycloak/keycloak.service';
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

  openOrClosePortail(): Observable<any> {
    return this.getHeaderWithToken().concatMap(headers =>
      this._http.post(this.API_URL + "opcl/", { headers: headers }));
  }

}
