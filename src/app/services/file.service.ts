import { Injectable } from '@angular/core';
import { Http, Headers, Response, ResponseContentType } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { environment } from '../../environments/environment';
import { KeycloakService } from '../keycloak/keycloak.service';
import { Member } from 'app/model/member';


@Injectable()
export class FileService {

    private API_URL: string = environment.API_URL;
    private API_URL4FILEONDISK: string = environment.API_URL4FILEONDISK;
    private user : Member;

    constructor(private _http: Http, private _keycloakService: KeycloakService) {
    }
    // Get the token for Keycloak Security
    getHeaderWithToken(): Observable<Headers> {
        let tokenPromise: Promise<string> = this._keycloakService.getToken();
        let tokenObservable: Observable<string> = Observable.fromPromise(tokenPromise);

        return tokenObservable.map(token => {
            return new Headers({
                'Author': 'Zeus',
                'Authorization': 'Bearer ' + token,
                'user':JSON.stringify(this.user)
            })
        })
    }
    // GET file    
    getFile(fileId: string): Observable<any> {
        return this.getHeaderWithToken().concatMap(headers =>
            this._http.get(this.API_URL + "file/" + fileId, { headers: headers, 'responseType': ResponseContentType.ArrayBuffer })
        )
    }

    // POST file on disk    
    postFileOnDisk(formData: FormData, user: Member): Observable<any> {
        this.user = user;
        return this.getHeaderWithToken().concatMap(headers =>
            this._http.post(this.API_URL4FILEONDISK , formData, { headers: headers, 'responseType': ResponseContentType.Json })
        )
    }
}
