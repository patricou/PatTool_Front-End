import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { KeycloakService } from 'app/keycloak/keycloak.service';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { urllink } from 'app/model/urllink';
import { Category } from 'app/model/Category';

@Injectable()
export class UrllinkService {

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
				'content-type': 'application/json',
				'Authorization': 'Bearer ' + token
			})
		})
	}

	getLinks(): Observable<any> {
		return this.getHeaderWithToken().concatMap(headers =>
			this._http.get(this.API_URL + "urllink/", { headers: headers })
				.map(res => res.json()))
	}

	getCategories(): Observable<any> {
		return this.getHeaderWithToken().concatMap(headers =>
			this._http.get(this.API_URL + "categories/", { headers: headers })
				.map(res => res.json()))
	}

	// PUT
	updateVisibility(urllink: urllink): Observable<Response> {
		return this.getHeaderWithToken().concatMap(headers =>
			this._http.put(this.API_URL + 'visibility/', JSON.stringify(urllink), { headers: headers })
		)
	}

}
