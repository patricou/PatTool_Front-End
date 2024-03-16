import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { Evenement } from '../model/evenement';
import { Member } from '../model/member';
import { UploadedFile } from '../model/uploadedfile';
import { environment } from '../../environments/environment';
import { KeycloakService } from '../keycloak/keycloak.service';


@Injectable()
export class EvenementsService {

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
	// GET + %name%
	getEvents(name: string, pageNumber: number, elementsByPage: number): Observable<any> {
		return this.getHeaderWithToken().concatMap(headers =>
			this._http.get(this.API_URL + "even/" + name + "/" + pageNumber + "/" + elementsByPage, { headers: headers })
				.map(res => res.json()))
	}

	// GET  + {id}
	getEvenement(id: string): Observable<Evenement> {
		return this.getHeaderWithToken().concatMap(headers => this._http.get(this.API_URL + "even/" + id, { headers: headers })
			.map(res => res.json())
			.map(evenement => {
				return new Evenement(
					evenement.author,
					evenement.closeInscriptionDate,
					evenement.comments,
					evenement.creationDate,
					evenement.endEventDate,
					evenement.beginEventDate,
					evenement.evenementName,
					evenement.id,
					evenement.map,
					evenement.photosUrl,
					evenement.members,
					evenement.openInscriptionDate,
					evenement.status,
					evenement.type,
					evenement.fileUploadeds,
					evenement.startHour,
					evenement.diffculty,
					evenement.startLocation,
					evenement.durationEstimation,
					evenement.ratingPlus,
					evenement.ratingMinus
				)
			}))
	}

	// POST
	postEvenement(evenement: Evenement): Observable<Response> {
		return this.getHeaderWithToken().concatMap(headers =>
			this._http.post(this.API_URL + 'even', JSON.stringify(evenement), { headers: headers })
		)
	}

	// PUT
	putEvenement(evenement: Evenement): Observable<Response> {
		return this.getHeaderWithToken().concatMap(headers =>
			this._http.put(this.API_URL + 'even', JSON.stringify(evenement), { headers: headers })
		)
	}

	// PUT : update for uploaded file --> when one is deleted
	put4FileEvenement(evenement: Evenement): Observable<Response> {
		return this.getHeaderWithToken().concatMap(headers =>
			this._http.put(this.API_URL + 'file', JSON.stringify(evenement), { headers: headers })
		)
	}

	// DELETE
	delEvenement(id: string): Observable<Response> {
		return this.getHeaderWithToken().concatMap(headers =>
			this._http.delete(this.API_URL + 'even/' + id, { headers: headers })
		)
	}

}
