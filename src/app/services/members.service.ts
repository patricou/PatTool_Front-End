import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { Member } from '../model/member';
import { environment } from '../../environments/environment';
import { KeycloakService } from '../keycloak/keycloak.service';


@Injectable()
export class MembersService {

    private API_URL: string = environment.API_URL;
    private user: Member;

    constructor(private _http: Http, private _keycloakService: KeycloakService) { }

    // GET  + {userName}
    setUser(member: Member) {
        this.user = member;
    };

    getUserId(): Observable<Member> {

        if (this.user.id == "") {

            const tokenPromise: Promise<string> = this._keycloakService.getToken();
            const tokenObservable: Observable<string> = Observable.fromPromise(tokenPromise);
            // Get the token  ( for security ) before sending the HTTP request.
            return tokenObservable.map(token => {
                console.log("1|------------------> GetToken ");
                return new Headers({
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                    'Author': 'Zeus himself'
                })
            }).concatMap(headers => {
                const requestOptions = new RequestOptions({ headers: headers });
                console.log("2|------------------> Just before user POST request");
                return this._http.post(this.API_URL + 'memb/user', JSON.stringify(this.user), requestOptions)
                    .map(res => {
                        console.log("3|------------------> " + res);
                        return res.json()
                    })
            })
        } else {
            return Observable.of(this.user);
        }
    };

    getUser(): Member {
        return this.user;
    };

}
