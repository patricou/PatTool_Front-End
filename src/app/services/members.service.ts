import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';

import { Observable   } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { Member } from '../model/member';
import { environment } from '../../environments/environment';
import { KeycloakService } from '../keycloak/keycloak.service';
import { stringify } from 'querystring';


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
                let now = new Date();
                console.log("1|------------------> GetToken : "+now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()+'.'+now.getMilliseconds());
                return new Headers({
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                    'Author': 'Zeus himself',
                    'User': JSON.stringify(this.user)
                })
            }).concatMap(headers => {
                const requestOptions = new RequestOptions({ headers: headers });
                let now = new Date();
                console.log("2|------------------> Just before user POST request : "+now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()+'.'+now.getMilliseconds());
                // New code 20240405
                return this._http.post(this.API_URL + 'memb/user', JSON.stringify(this.user), requestOptions)
                    .timeout(10000) // Attendre jusqu'à 5 secondes pour une réponse
                    .map(res => {
                        let now = new Date();
                        console.log("3|------------------> OK : "+now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()+'.'+now.getMilliseconds() );
                        return res.json();
                    })
                    .catch(error => {
                        console.error("¦=================> Error:", error);
                        alert("Issue to get the Id of the user : " + error);
                        return Observable.throw(error); // Renvoyer l'erreur pour la propager plus loin
                    });

            })
        } else {
            let now = new Date();
            console.log("4|------------------> user.id was alreday set : "+this.user.id+ " at "+now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()+'.'+now.getMilliseconds() );
            return Observable.of(this.user);
        }
    };

    getUser(): Member {
        return this.user;
    }

}
