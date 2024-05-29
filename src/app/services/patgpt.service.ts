import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { KeycloakService } from 'app/keycloak/keycloak.service';
import { ChatResponse } from 'app/model/chat-response';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class PatgptService {
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

  getPatGptResponse(question: string, sendWithHistorical: boolean): Observable<any> {

    const requestBody = { userInput: question };

    return this.getHeaderWithToken().concatMap(headers =>
      this._http.post(this.API_URL + "chat/" + sendWithHistorical, JSON.stringify(requestBody), { headers: headers })
        .map((response: Response) => new ChatResponse(response.json())));
  }

  delPatGptHistorical(): Observable<any> {

    //alert("Historical called");

    return this.getHeaderWithToken().concatMap(headers =>
      this._http.delete(this.API_URL + "delchat/", { headers: headers }));
  }

}